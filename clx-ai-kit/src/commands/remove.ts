import * as p from '@clack/prompts';
import { COMPONENT_TYPES } from '../types.js';
import {
  readConfig,
  writeConfig,
  removeComponent,
  hasComponent,
} from '../utils/config.js';
import { intro, outro, warn, error, handleCancel } from '../utils/prompts.js';
import { removeComponentFiles } from '../scaffolders/index.js';
import { normalizeType } from '../utils/normalize.js';

export async function removeCommand(
  type: string,
  name: string,
): Promise<void> {
  const cwd = process.cwd();
  intro('AI DevKit — Remove Component');

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

  if (!hasComponent(config, componentType, name)) {
    warn(`${type} "${name}" is not installed.`);
    outro('No changes made.');
    return;
  }

  const confirmed = await p.confirm({
    message: `Remove ${type} "${name}"? This will delete the files.`,
  });
  handleCancel(confirmed);
  if (!confirmed) {
    outro('No changes made.');
    return;
  }

  await removeComponentFiles(cwd, config.environments, componentType, name);
  const updatedConfig = removeComponent(config, componentType, name);
  await writeConfig(cwd, updatedConfig);

  outro(`Removed ${type} "${name}" successfully.`);
}
