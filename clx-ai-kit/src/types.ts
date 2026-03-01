export type Environment = 'cursor' | 'antigravity' | 'claude-code';

export type ComponentType = 'skill' | 'command' | 'rule' | 'phase';

export const COMPONENT_TYPES: readonly ComponentType[] = [
  'skill',
  'command',
  'rule',
  'phase',
] as const;

export const ENVIRONMENTS: readonly Environment[] = [
  'cursor',
  'antigravity',
  'claude-code',
] as const;

export const PHASES = [
  'requirements',
  'design',
  'planning',
  'implementation',
  'testing',
  'deployment',
  'monitoring',
] as const;

export type Phase = (typeof PHASES)[number];

export interface DevKitConfig {
  readonly version: string;
  readonly cliVersion: string;
  readonly environments: readonly Environment[];
  readonly initializedPhases: readonly string[];
  readonly installedSkills: readonly string[];
  readonly installedCommands: readonly string[];
  readonly installedRules: readonly string[];
}

export interface ComponentMeta {
  readonly name: string;
  readonly description: string;
  readonly type: ComponentType;
  readonly templatePath: string;
}

export interface OperationResult {
  readonly success: boolean;
  readonly message: string;
}
