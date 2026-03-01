import path from 'node:path';
import type { ComponentMeta, Environment } from '../types.js';
import { copyDirectory, copyFile, removeFileOrDir } from '../utils/fs.js';
import { sharedTemplatesDir } from '../utils/paths.js';

export async function scaffoldSharedFiles(
  cwd: string,
  environments?: readonly Environment[],
): Promise<void> {
  const agentsMdSrc = path.join(sharedTemplatesDir(), 'AGENTS.md');
  await copyFile(agentsMdSrc, path.join(cwd, 'AGENTS.md'));

  if (environments?.includes('claude-code')) {
    const claudeMdSrc = path.join(sharedTemplatesDir(), 'CLAUDE.md');
    await copyFile(claudeMdSrc, path.join(cwd, 'CLAUDE.md'));
  }
}

export async function scaffoldPhase(
  cwd: string,
  component: ComponentMeta,
): Promise<void> {
  const target = path.join(cwd, 'docs', 'ai', component.name);
  await copyDirectory(component.templatePath, target);
}

export async function removePhase(
  cwd: string,
  name: string,
): Promise<void> {
  const target = path.join(cwd, 'docs', 'ai', name);
  await removeFileOrDir(target);
}
