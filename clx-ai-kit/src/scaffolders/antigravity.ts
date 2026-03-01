import path from 'node:path';
import fs from 'fs-extra';
import type { ComponentMeta, ComponentType } from '../types.js';
import { copyDirectory, copyFile, removeFileOrDir } from '../utils/fs.js';

const TYPE_DIR_MAP: Record<Exclude<ComponentType, 'phase'>, string> = {
  skill: '.agent/skills',
  command: '.agent/workflows',
  rule: '.agent/rules',
};

export function antigravityTargetPath(
  cwd: string,
  type: ComponentType,
  name: string,
): string {
  if (type === 'phase') return path.join(cwd, 'docs', 'ai', name);

  const dir = TYPE_DIR_MAP[type];
  if (type === 'skill') return path.join(cwd, dir, name);
  return path.join(cwd, dir, `${name}.md`);
}

async function copyRuleWithConversion(
  src: string,
  dest: string,
): Promise<void> {
  const content = await fs.readFile(src, 'utf-8');
  await fs.ensureDir(path.dirname(dest));
  await fs.writeFile(dest, content, 'utf-8');
}

export async function scaffoldAntigravityComponent(
  cwd: string,
  component: ComponentMeta,
): Promise<void> {
  const target = antigravityTargetPath(cwd, component.type, component.name);

  if (component.type === 'skill') {
    await copyDirectory(component.templatePath, target);
    return;
  }

  if (component.type === 'rule') {
    await copyRuleWithConversion(component.templatePath, target);
    return;
  }

  await copyFile(component.templatePath, target);
}

export async function removeAntigravityComponent(
  cwd: string,
  type: ComponentType,
  name: string,
): Promise<void> {
  const target = antigravityTargetPath(cwd, type, name);
  await removeFileOrDir(target);
}
