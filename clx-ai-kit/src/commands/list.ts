import pc from 'picocolors';
import type { ComponentType } from '../types.js';
import { COMPONENT_TYPES } from '../types.js';
import { readConfig } from '../utils/config.js';
import { intro, outro, error, info } from '../utils/prompts.js';
import { loadRegistry, filterByType } from '../registry/index.js';
import { normalizeType } from '../utils/normalize.js';

function formatInstalled(installed: boolean): string {
  return installed
    ? pc.green('✓ installed')
    : pc.dim('✗ not installed');
}

function installedList(
  config: { readonly installedSkills: readonly string[]; readonly installedCommands: readonly string[]; readonly installedRules: readonly string[]; readonly initializedPhases: readonly string[] },
  type: ComponentType,
): readonly string[] {
  const map: Record<ComponentType, readonly string[]> = {
    skill: config.installedSkills,
    command: config.installedCommands,
    rule: config.installedRules,
    phase: config.initializedPhases,
  };
  return map[type];
}

export async function listCommand(type?: string): Promise<void> {
  const cwd = process.cwd();
  intro('AI DevKit — Components');

  const resolved = type ? normalizeType(type) : null;
  if (type && !resolved) {
    error(`Invalid type "${type}". Valid types: ${COMPONENT_TYPES.join(', ')}`);
    process.exit(1);
  }

  const config = await readConfig(cwd);
  const registry = await loadRegistry();
  const typesToShow = resolved
    ? [resolved]
    : [...COMPONENT_TYPES];

  for (const t of typesToShow) {
    const components = filterByType(registry, t);
    const installed = config ? installedList(config, t) : [];

    info(pc.bold(`${t}s (${components.length} available)`));
    for (const component of components) {
      const isInstalled = installed.includes(component.name);
      const status = formatInstalled(isInstalled);
      const desc = component.description
        ? pc.dim(` — ${component.description.slice(0, 50)}`)
        : '';
      console.log(`  ${pc.cyan(component.name.padEnd(30))} ${status}${desc}`);
    }
    console.log();
  }

  if (!config) {
    info(pc.dim('No .ai-devkit.json found. Run "aidk init" to get started.'));
  }

  outro('Done.');
}
