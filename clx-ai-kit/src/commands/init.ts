import * as p from '@clack/prompts';
import type { Environment, Phase } from '../types.js';
import { ENVIRONMENTS, PHASES } from '../types.js';
import { VERSION } from '../version.js';
import {
  readConfig,
  writeConfig,
  createDefaultConfig,
  addComponent,
} from '../utils/config.js';
import {
  intro,
  outro,
  handleCancel,
  warn,
  step,
  info,
} from '../utils/prompts.js';
import { loadRegistry, filterByType } from '../registry/index.js';
import {
  scaffoldComponent,
  scaffoldSharedFiles,
} from '../scaffolders/index.js';

export async function initCommand(options: { force?: boolean }): Promise<void> {
  const cwd = process.cwd();
  intro('AI DevKit Setup');
  info('Tip: Press <Space> to select items, <Enter> to confirm.');

  const existing = await readConfig(cwd);
  if (existing && !options.force) {
    const shouldContinue = await p.confirm({
      message: 'AI DevKit is already initialized in this project. Re-initialize?',
    });
    handleCancel(shouldContinue);
    if (!shouldContinue) {
      outro('No changes made.');
      return;
    }
  }

  const envSelection = await p.multiselect({
    message: 'Which IDEs do you want to support?',
    options: ENVIRONMENTS.map((env) => ({
      value: env,
      label: env === 'cursor' ? 'Cursor (.cursor/)' : env === 'claude-code' ? 'Claude Code (.claude/)' : 'Antigravity (.agent/)',
    })),
    initialValues: existing?.environments ? (existing.environments as Environment[]) : undefined,
    required: true,
  });
  handleCancel(envSelection);
  const environments = Array.from(new Set([
    ...(existing?.environments || []),
    ...(envSelection as Environment[])
  ])) as Environment[];

  const phaseSelection = await p.multiselect({
    message: 'Which doc phases to scaffold?',
    options: PHASES.map((phase) => ({
      value: phase,
      label: phase,
    })),
    initialValues: ['requirements', 'design', 'planning', 'implementation', 'testing', 'deployment', 'monitoring'] as Phase[],
    required: true,
  });
  handleCancel(phaseSelection);
  const phases = phaseSelection as Phase[];

  const registry = await loadRegistry();
  const availableSkills = filterByType(registry, 'skill');

  const skillMode = await p.select({
    message: `Include skills? (${availableSkills.length} available)`,
    options: [
      { value: 'all', label: 'All skills' },
      { value: 'select', label: 'Select individually' },
      { value: 'none', label: 'None (add later with aidk add)' },
    ],
  });
  handleCancel(skillMode);

  let selectedSkills: string[] = [];
  if (skillMode === 'all') {
    selectedSkills = availableSkills.map((s) => s.name);
  } else if (skillMode === 'select') {
    const skillSelection = await p.multiselect({
      message: 'Select skills to install:',
      options: availableSkills.map((s) => ({
        value: s.name,
        label: s.name,
        hint: s.description.slice(0, 60),
      })),
    });
    handleCancel(skillSelection);
    selectedSkills = skillSelection as string[];
  }

  const s = p.spinner();
  s.start('Scaffolding project...');

  let config = existing || createDefaultConfig(VERSION);
  config = { ...config, environments, cliVersion: VERSION };

  await scaffoldSharedFiles(cwd, environments);

  for (const phase of phases) {
    const component = registry.find(
      (c) => c.type === 'phase' && c.name === phase,
    );
    if (component) {
      await scaffoldComponent(cwd, environments, component);
      config = addComponent(config, 'phase', phase);
    }
  }

  const allCommands = filterByType(registry, 'command');
  for (const cmd of allCommands) {
    await scaffoldComponent(cwd, environments, cmd);
    config = addComponent(config, 'command', cmd.name);
  }

  const allRules = filterByType(registry, 'rule');
  for (const rule of allRules) {
    await scaffoldComponent(cwd, environments, rule);
    config = addComponent(config, 'rule', rule.name);
  }

  for (const skillName of selectedSkills) {
    const skill = availableSkills.find((s) => s.name === skillName);
    if (skill) {
      await scaffoldComponent(cwd, environments, skill);
      config = addComponent(config, 'skill', skillName);
    }
  }

  await writeConfig(cwd, config);
  s.stop('Project scaffolded!');

  step(`Environments: ${environments.join(', ')}`);
  step(`Phases: ${phases.join(', ')}`);
  step(`Commands: ${allCommands.length} installed`);
  step(`Rules: ${allRules.length} installed`);
  step(`Skills: ${selectedSkills.length} installed`);

  outro('AI DevKit is ready!');
}
