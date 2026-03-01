import path from 'node:path';
import { createHash } from 'node:crypto';
import fs from 'fs-extra';

export async function copyFile(
  src: string,
  dest: string,
): Promise<void> {
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(src, dest, { overwrite: true });
}

export async function copyDirectory(
  src: string,
  dest: string,
): Promise<void> {
  await fs.ensureDir(dest);
  await fs.copy(src, dest, { overwrite: true });
}

export async function removeFileOrDir(target: string): Promise<void> {
  const exists = await fs.pathExists(target);
  if (!exists) return;
  await fs.remove(target);
}

export async function fileHash(filePath: string): Promise<string | null> {
  const exists = await fs.pathExists(filePath);
  if (!exists) return null;

  const stat = await fs.stat(filePath);
  if (stat.isDirectory()) return null;

  const content = await fs.readFile(filePath);
  return createHash('sha256').update(content).digest('hex');
}

export async function filesAreDifferent(
  pathA: string,
  pathB: string,
): Promise<boolean> {
  const [statA, statB] = await Promise.all([
    fs.stat(pathA).catch(() => null),
    fs.stat(pathB).catch(() => null),
  ]);

  if (!statA || !statB) return true;
  if (statA.isDirectory() !== statB.isDirectory()) return true;

  if (statA.isDirectory()) {
    const [filesA, filesB] = await Promise.all([
      listFiles(pathA),
      listFiles(pathB),
    ]);

    if (filesA.length !== filesB.length) return true;
    for (let i = 0; i < filesA.length; i++) {
      if (filesA[i] !== filesB[i]) return true;
      const different = await filesAreDifferent(
        path.join(pathA, filesA[i]),
        path.join(pathB, filesA[i]),
      );
      if (different) return true;
    }
    return false;
  }

  const [hashA, hashB] = await Promise.all([
    fileHash(pathA),
    fileHash(pathB),
  ]);

  if (hashA === null || hashB === null) return true;
  return hashA !== hashB;
}

export async function listFiles(dir: string): Promise<string[]> {
  const exists = await fs.pathExists(dir);
  if (!exists) return [];

  const entries: string[] = [];
  const walk = async (current: string) => {
    const items = await fs.readdir(current, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(current, item.name);
      if (item.isDirectory()) {
        await walk(fullPath);
      } else {
        entries.push(path.relative(dir, fullPath));
      }
    }
  };
  await walk(dir);
  return entries.sort();
}
