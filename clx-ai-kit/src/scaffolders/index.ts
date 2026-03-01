import type { ComponentMeta, ComponentType, Environment } from '../types.js';
import {
  scaffoldCursorComponent,
  removeCursorComponent,
} from './cursor.js';
import {
  scaffoldAntigravityComponent,
  removeAntigravityComponent,
} from './antigravity.js';
import {
  scaffoldClaudeCodeComponent,
  removeClaudeCodeComponent,
} from './claude-code.js';
import { scaffoldPhase, removePhase } from './shared.js';

export async function scaffoldComponent(
  cwd: string,
  environments: readonly Environment[],
  component: ComponentMeta,
): Promise<void> {
  if (component.type === 'phase') {
    await scaffoldPhase(cwd, component);
    return;
  }

  for (const env of environments) {
    if (env === 'cursor') {
      await scaffoldCursorComponent(cwd, component);
    } else if (env === 'antigravity') {
      await scaffoldAntigravityComponent(cwd, component);
    } else if (env === 'claude-code') {
      await scaffoldClaudeCodeComponent(cwd, component);
    }
  }
}

export async function removeComponentFiles(
  cwd: string,
  environments: readonly Environment[],
  type: ComponentType,
  name: string,
): Promise<void> {
  if (type === 'phase') {
    await removePhase(cwd, name);
    return;
  }

  for (const env of environments) {
    if (env === 'cursor') {
      await removeCursorComponent(cwd, type, name);
    } else if (env === 'antigravity') {
      await removeAntigravityComponent(cwd, type, name);
    } else if (env === 'claude-code') {
      await removeClaudeCodeComponent(cwd, type, name);
    }
  }
}

export { scaffoldSharedFiles } from './shared.js';
