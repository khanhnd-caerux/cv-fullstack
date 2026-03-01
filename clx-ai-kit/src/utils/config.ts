import path from 'node:path';
import fs from 'fs-extra';
import type { ComponentType, DevKitConfig } from '../types.js';

const CONFIG_FILENAME = '.ai-devkit.json';

function configPath(cwd: string): string {
  return path.join(cwd, CONFIG_FILENAME);
}

export async function readConfig(cwd: string): Promise<DevKitConfig | null> {
  const filePath = configPath(cwd);
  const exists = await fs.pathExists(filePath);
  if (!exists) return null;

  const raw = await fs.readJson(filePath);
  return {
    version: raw.version ?? '0.0.0',
    cliVersion: raw.cliVersion ?? '0.0.0',
    environments: raw.environments ?? [],
    initializedPhases: raw.initializedPhases ?? [],
    installedSkills: raw.installedSkills ?? [],
    installedCommands: raw.installedCommands ?? [],
    installedRules: raw.installedRules ?? [],
  };
}

export async function writeConfig(
  cwd: string,
  config: DevKitConfig,
): Promise<void> {
  const filePath = configPath(cwd);
  await fs.writeJson(filePath, config, { spaces: 2 });
}

export function createDefaultConfig(
  cliVersion: string,
): DevKitConfig {
  return {
    version: '1.0.0',
    cliVersion,
    environments: [],
    initializedPhases: [],
    installedSkills: [],
    installedCommands: [],
    installedRules: [],
  };
}

const CONFIG_KEY_MAP: Record<ComponentType, keyof DevKitConfig> = {
  skill: 'installedSkills',
  command: 'installedCommands',
  rule: 'installedRules',
  phase: 'initializedPhases',
};

export function addComponent(
  config: DevKitConfig,
  type: ComponentType,
  name: string,
): DevKitConfig {
  const key = CONFIG_KEY_MAP[type];
  const current = config[key] as readonly string[];
  if (current.includes(name)) return config;
  return { ...config, [key]: [...current, name] };
}

export function removeComponent(
  config: DevKitConfig,
  type: ComponentType,
  name: string,
): DevKitConfig {
  const key = CONFIG_KEY_MAP[type];
  const current = config[key] as readonly string[];
  return { ...config, [key]: current.filter((n) => n !== name) };
}

export function hasComponent(
  config: DevKitConfig,
  type: ComponentType,
  name: string,
): boolean {
  const key = CONFIG_KEY_MAP[type];
  return (config[key] as readonly string[]).includes(name);
}

export function configExists(cwd: string): Promise<boolean> {
  return fs.pathExists(configPath(cwd));
}
