import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';
import {
  readConfig,
  writeConfig,
  createDefaultConfig,
  addComponent,
  removeComponent,
  hasComponent,
  configExists,
} from '../../src/utils/config.js';
import type { DevKitConfig } from '../../src/types.js';

function makeConfig(overrides: Partial<DevKitConfig> = {}): DevKitConfig {
  return {
    version: '1.0.0',
    cliVersion: '0.1.0',
    environments: [],
    initializedPhases: [],
    installedSkills: [],
    installedCommands: [],
    installedRules: [],
    ...overrides,
  };
}

describe('createDefaultConfig', () => {
  it('returns config with given cliVersion', () => {
    const config = createDefaultConfig('1.2.3');
    expect(config.cliVersion).toBe('1.2.3');
    expect(config.version).toBe('1.0.0');
  });

  it('returns config with empty arrays', () => {
    const config = createDefaultConfig('0.0.1');
    expect(config.environments).toEqual([]);
    expect(config.initializedPhases).toEqual([]);
    expect(config.installedSkills).toEqual([]);
    expect(config.installedCommands).toEqual([]);
    expect(config.installedRules).toEqual([]);
  });
});

describe('addComponent', () => {
  it('adds a skill to installedSkills', () => {
    const config = makeConfig();
    const updated = addComponent(config, 'skill', 'my-skill');
    expect(updated.installedSkills).toContain('my-skill');
  });

  it('adds a command to installedCommands', () => {
    const config = makeConfig();
    const updated = addComponent(config, 'command', 'my-cmd');
    expect(updated.installedCommands).toContain('my-cmd');
  });

  it('adds a rule to installedRules', () => {
    const config = makeConfig();
    const updated = addComponent(config, 'rule', 'my-rule');
    expect(updated.installedRules).toContain('my-rule');
  });

  it('adds a phase to initializedPhases', () => {
    const config = makeConfig();
    const updated = addComponent(config, 'phase', 'requirements');
    expect(updated.initializedPhases).toContain('requirements');
  });

  it('does not duplicate an existing component', () => {
    const config = makeConfig({ installedSkills: ['my-skill'] });
    const updated = addComponent(config, 'skill', 'my-skill');
    expect(updated.installedSkills).toEqual(['my-skill']);
  });

  it('does not mutate the original config', () => {
    const config = makeConfig();
    addComponent(config, 'skill', 'new-skill');
    expect(config.installedSkills).toEqual([]);
  });
});

describe('removeComponent', () => {
  it('removes a skill from installedSkills', () => {
    const config = makeConfig({ installedSkills: ['a', 'b'] });
    const updated = removeComponent(config, 'skill', 'a');
    expect(updated.installedSkills).toEqual(['b']);
  });

  it('is a no-op if the component does not exist', () => {
    const config = makeConfig({ installedSkills: ['a'] });
    const updated = removeComponent(config, 'skill', 'nonexistent');
    expect(updated.installedSkills).toEqual(['a']);
  });

  it('does not mutate the original config', () => {
    const config = makeConfig({ installedSkills: ['a'] });
    removeComponent(config, 'skill', 'a');
    expect(config.installedSkills).toEqual(['a']);
  });
});

describe('hasComponent', () => {
  it('returns true when component is present', () => {
    const config = makeConfig({ installedSkills: ['my-skill'] });
    expect(hasComponent(config, 'skill', 'my-skill')).toBe(true);
  });

  it('returns false when component is absent', () => {
    const config = makeConfig();
    expect(hasComponent(config, 'skill', 'missing')).toBe(false);
  });
});

describe('readConfig / writeConfig / configExists', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aidk-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('configExists returns false when no config file', async () => {
    expect(await configExists(tmpDir)).toBe(false);
  });

  it('readConfig returns null when no config file', async () => {
    expect(await readConfig(tmpDir)).toBeNull();
  });

  it('writeConfig writes file and readConfig reads it back', async () => {
    const config = makeConfig({ cliVersion: '0.5.0' });
    await writeConfig(tmpDir, config);

    expect(await configExists(tmpDir)).toBe(true);

    const read = await readConfig(tmpDir);
    expect(read).not.toBeNull();
    expect(read!.version).toBe('1.0.0');
    expect(read!.cliVersion).toBe('0.5.0');
  });

  it('readConfig fills in defaults for missing fields', async () => {
    const filePath = path.join(tmpDir, '.ai-devkit.json');
    await fs.writeJson(filePath, { version: '2.0.0' });

    const config = await readConfig(tmpDir);
    expect(config!.version).toBe('2.0.0');
    expect(config!.cliVersion).toBe('0.0.0');
    expect(config!.installedSkills).toEqual([]);
  });
});
