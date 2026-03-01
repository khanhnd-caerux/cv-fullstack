import path from 'node:path';
import type { ComponentMeta, ComponentType } from '../types.js';
import { copyDirectory, copyFile, removeFileOrDir } from '../utils/fs.js';

const TYPE_DIR_MAP: Record<Exclude<ComponentType, 'phase'>, string> = {
  skill: '.cursor/skills',
  command: '.cursor/commands',
  rule: '.cursor/rules',
};

export function cursorTargetPath(
  cwd: string,
  type: ComponentType,
  name: string,
): string {
  if (type === 'phase') return path.join(cwd, 'docs', 'ai', name);

  const dir = TYPE_DIR_MAP[type];
  if (type === 'skill') return path.join(cwd, dir, name);
  if (type === 'rule') return path.join(cwd, dir, `${name}.mdc`);
  return path.join(cwd, dir, `${name}.md`);
}

export async function scaffoldCursorComponent(
  cwd: string,
  component: ComponentMeta,
): Promise<void> {
  const target = cursorTargetPath(cwd, component.type, component.name);

  if (component.type === 'skill') {
    await copyDirectory(component.templatePath, target);
  } else {
    await copyFile(component.templatePath, target);
  }
}

export async function removeCursorComponent(
  cwd: string,
  type: ComponentType,
  name: string,
): Promise<void> {
  const target = cursorTargetPath(cwd, type, name);
  await removeFileOrDir(target);
}
