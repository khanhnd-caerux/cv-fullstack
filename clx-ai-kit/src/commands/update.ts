import path from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { ComponentType } from '../types.js';
import { VERSION } from '../version.js';
import { readConfig, writeConfig } from '../utils/config.js';
import { intro, outro, error, info, handleCancel } from '../utils/prompts.js';
import { loadRegistry, findComponent } from '../registry/index.js';
import { filesAreDifferent } from '../utils/fs.js';
import { scaffoldComponent } from '../scaffolders/index.js';
import { scaffoldSharedFiles } from '../scaffolders/shared.js';
import { cursorTargetPath } from '../scaffolders/cursor.js';
import { claudeCodeTargetPath } from '../scaffolders/claude-code.js';
import { sharedTemplatesDir, claudeCodeTemplatesDir } from '../utils/paths.js';

interface FileChange {
  readonly component: string;
  readonly type: ComponentType | 'shared';
  readonly templatePath: string;
  readonly installedPath: string;
  readonly isNew: boolean;
}

async function detectChanges(
  cwd: string,
  config: {
    readonly environments: readonly string[];
    readonly installedSkills: readonly string[];
    readonly installedCommands: readonly string[];
    readonly installedRules: readonly string[];
    readonly initializedPhases: readonly string[];
  },
): Promise<FileChange[]> {
  const registry = await loadRegistry();
  const changes: FileChange[] = [];

  const installed: Array<{ type: ComponentType; name: string }> = [
    ...config.installedSkills.map((n) => ({ type: 'skill' as const, name: n })),
    ...config.installedCommands.map((n) => ({ type: 'command' as const, name: n })),
    ...config.installedRules.map((n) => ({ type: 'rule' as const, name: n })),
    ...config.initializedPhases.map((n) => ({ type: 'phase' as const, name: n })),
  ];

  for (const item of installed) {
    const component = findComponent(registry, item.type, item.name);
    if (!component) continue;

    let isDifferent = false;
    let fallbackInstalledPath = cursorTargetPath(cwd, item.type, item.name);

    for (const env of config.environments) {
      if (env === 'antigravity') continue;

      const envTargetPath = env === 'claude-code'
        ? claudeCodeTargetPath(cwd, item.type, item.name)
        : cursorTargetPath(cwd, item.type, item.name);

      let envTemplatePath = component.templatePath;
      if (env === 'claude-code' && ['skill', 'command', 'rule'].includes(item.type)) {
        const typeDirs: Record<string, string> = {
          skill: 'skills',
          command: 'commands',
          rule: 'rules',
        };
        const filename = item.type === 'skill' ? item.name :
          item.type === 'rule' ? `${component.name}.md` :
            `${component.name}.md`;
        envTemplatePath = path.join(claudeCodeTemplatesDir(), typeDirs[item.type], filename);
      }

      if (await filesAreDifferent(envTemplatePath, envTargetPath)) {
        isDifferent = true;
        fallbackInstalledPath = envTargetPath;
        break;
      }
    }

    if (isDifferent) {
      changes.push({
        component: `${item.type}/${item.name}`,
        type: item.type,
        templatePath: component.templatePath,
        installedPath: fallbackInstalledPath,
        isNew: false,
      });
    }
  }

  const allComponents = registry;
  for (const component of allComponents) {
    const isInstalled = installed.some(
      (i) => i.type === component.type && i.name === component.name,
    );
    if (isInstalled) continue;

    const preferClaudeCode = config.environments.includes('claude-code') && !config.environments.includes('cursor');
    const newInstalledPath = preferClaudeCode
      ? claudeCodeTargetPath(cwd, component.type, component.name)
      : cursorTargetPath(cwd, component.type, component.name);

    changes.push({
      component: `${component.type}/${component.name}`,
      type: component.type,
      templatePath: component.templatePath,
      installedPath: newInstalledPath,
      isNew: true,
    });
  }

  const agentsMdTemplate = path.join(sharedTemplatesDir(), 'AGENTS.md');
  const agentsMdInstalled = path.join(cwd, 'AGENTS.md');
  const agentsMdDifferent = await filesAreDifferent(
    agentsMdTemplate,
    agentsMdInstalled,
  );

  if (agentsMdDifferent) {
    changes.push({
      component: 'shared/AGENTS.md',
      type: 'shared',
      templatePath: agentsMdTemplate,
      installedPath: agentsMdInstalled,
      isNew: false,
    });
  }

  return changes;
}

export async function updateCommand(): Promise<void> {
  const cwd = process.cwd();
  intro(`AI DevKit — Update (CLI v${VERSION})`);

  const config = await readConfig(cwd);
  if (!config) {
    error('No .ai-devkit.json found. Run "aidk init" first.');
    process.exit(1);
  }

  const s = p.spinner();
  try {
    s.start('Checking for changes...');
    const changes = await detectChanges(cwd, config);
    s.stop('Check complete.');

    if (changes.length === 0) {
      info('Already up to date. No changes detected.');
      outro('Done.');
      return;
    }

    const modified = changes.filter((c) => !c.isNew);
    const newItems = changes.filter((c) => c.isNew);

    if (modified.length > 0) {
      info(pc.bold('Modified:'));
      for (const c of modified) {
        console.log(`  ${pc.yellow('~')} ${c.component}`);
      }
    }

    if (newItems.length > 0) {
      info(pc.bold('New (not yet installed):'));
      for (const c of newItems) {
        console.log(`  ${pc.green('+')} ${c.component}`);
      }
    }

    console.log();

    const action = await p.select({
      message: `Apply changes? (${modified.length} modified, ${newItems.length} new)`,
      options: [
        { value: 'all', label: 'Yes, update all' },
        { value: 'select', label: 'Select files individually' },
        { value: 'cancel', label: 'Cancel' },
      ],
    });
    handleCancel(action);

    if (action === 'cancel') {
      outro('No changes made.');
      return;
    }

    let selectedChanges = changes;
    if (action === 'select') {
      const selection = await p.multiselect({
        message: 'Select changes to apply:',
        options: changes.map((c) => ({
          value: c.component,
          label: `${c.isNew ? pc.green('+') : pc.yellow('~')} ${c.component}`,
        })),
      });
      handleCancel(selection);
      const selectedNames = selection as string[];
      selectedChanges = changes.filter((c) =>
        selectedNames.includes(c.component),
      );
    }

    const registry = await loadRegistry();
    const updateSpinner = p.spinner();
    updateSpinner.start('Applying updates...');

    let updatedConfig = { ...config };
    for (const change of selectedChanges) {
      if (change.type === 'shared') {
        await scaffoldSharedFiles(cwd, config.environments);
        continue;
      }

      const component = findComponent(registry, change.type, change.component.split('/')[1]);
      if (!component) continue;
      await scaffoldComponent(cwd, config.environments, component);

      if (change.isNew) {
        const { addComponent } = await import('../utils/config.js');
        updatedConfig = addComponent(updatedConfig, change.type, component.name);
      }
    }

    updatedConfig = { ...updatedConfig, cliVersion: VERSION };
    await writeConfig(cwd, updatedConfig);
    updateSpinner.stop('Updates applied.');

    outro(`Updated ${selectedChanges.length} component(s).`);
  } catch (err) {
    s.stop('Failed.');
    error(`Update failed: ${err instanceof Error ? err.stack || err.message : String(err)}`);
    process.exit(1);
  }
}
