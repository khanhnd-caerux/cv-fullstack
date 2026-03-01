import { COMPONENT_TYPES } from '../types.js';
import { readConfig, writeConfig, addComponent, hasComponent } from '../utils/config.js';
import { intro, outro, warn, error } from '../utils/prompts.js';
import { loadRegistry, findComponent, filterByType } from '../registry/index.js';
import { scaffoldComponent } from '../scaffolders/index.js';
import { normalizeType } from '../utils/normalize.js';

export async function addCommand(
  type: string,
  name: string,
): Promise<void> {
  const cwd = process.cwd();
  intro('AI DevKit — Add Component');

  const componentType = normalizeType(type);
  if (!componentType) {
    error(`Invalid type "${type}". Valid types: ${COMPONENT_TYPES.join(', ')}`);
    process.exit(1);
  }
  const config = await readConfig(cwd);
  if (!config) {
    error('No .ai-devkit.json found. Run "aidk init" first.');
    process.exit(1);
  }

  const registry = await loadRegistry();
  const component = findComponent(registry, componentType, name);
  if (!component) {
    const available = filterByType(registry, componentType).map((c) => c.name);
    error(`Component "${name}" not found in ${type}s.`);
    if (available.length > 0) {
      warn(`Available ${type}s: ${available.join(', ')}`);
    }
    process.exit(1);
  }

  if (hasComponent(config, componentType, name)) {
    warn(`${type} "${name}" is already installed. Skipping.`);
    outro('No changes made.');
    return;
  }

  await scaffoldComponent(cwd, config.environments, component);
  const updatedConfig = addComponent(config, componentType, name);
  await writeConfig(cwd, updatedConfig);

  outro(`Added ${type} "${name}" successfully.`);
}
