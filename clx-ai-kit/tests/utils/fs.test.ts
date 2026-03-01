import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';
import {
  copyFile,
  copyDirectory,
  removeFileOrDir,
  fileHash,
  filesAreDifferent,
  listFiles,
} from '../../src/utils/fs.js';

describe('copyFile', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aidk-fs-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('copies a file to a new location', async () => {
    const src = path.join(tmpDir, 'src.txt');
    const dest = path.join(tmpDir, 'sub', 'dest.txt');
    await fs.writeFile(src, 'hello');

    await copyFile(src, dest);

    expect(await fs.pathExists(dest)).toBe(true);
    expect(await fs.readFile(dest, 'utf-8')).toBe('hello');
  });

  it('creates parent directories if they do not exist', async () => {
    const src = path.join(tmpDir, 'file.txt');
    const dest = path.join(tmpDir, 'a', 'b', 'c', 'file.txt');
    await fs.writeFile(src, 'data');

    await copyFile(src, dest);

    expect(await fs.pathExists(dest)).toBe(true);
  });

  it('overwrites an existing destination file', async () => {
    const src = path.join(tmpDir, 'src.txt');
    const dest = path.join(tmpDir, 'dest.txt');
    await fs.writeFile(src, 'new content');
    await fs.writeFile(dest, 'old content');

    await copyFile(src, dest);

    expect(await fs.readFile(dest, 'utf-8')).toBe('new content');
  });
});

describe('copyDirectory', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aidk-fs-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('copies a directory with its contents', async () => {
    const srcDir = path.join(tmpDir, 'src');
    await fs.ensureDir(srcDir);
    await fs.writeFile(path.join(srcDir, 'a.txt'), 'a');
    await fs.writeFile(path.join(srcDir, 'b.txt'), 'b');

    const destDir = path.join(tmpDir, 'dest');
    await copyDirectory(srcDir, destDir);

    expect(await fs.readFile(path.join(destDir, 'a.txt'), 'utf-8')).toBe('a');
    expect(await fs.readFile(path.join(destDir, 'b.txt'), 'utf-8')).toBe('b');
  });
});

describe('removeFileOrDir', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aidk-fs-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('removes an existing file', async () => {
    const file = path.join(tmpDir, 'file.txt');
    await fs.writeFile(file, 'x');

    await removeFileOrDir(file);

    expect(await fs.pathExists(file)).toBe(false);
  });

  it('removes an existing directory', async () => {
    const dir = path.join(tmpDir, 'subdir');
    await fs.ensureDir(dir);
    await fs.writeFile(path.join(dir, 'file.txt'), 'y');

    await removeFileOrDir(dir);

    expect(await fs.pathExists(dir)).toBe(false);
  });

  it('is a no-op for a non-existent path', async () => {
    const missing = path.join(tmpDir, 'does-not-exist.txt');
    await expect(removeFileOrDir(missing)).resolves.toBeUndefined();
  });
});

describe('fileHash', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aidk-fs-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('returns a hex string for an existing file', async () => {
    const file = path.join(tmpDir, 'file.txt');
    await fs.writeFile(file, 'hello');

    const hash = await fileHash(file);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns the same hash for files with identical content', async () => {
    const a = path.join(tmpDir, 'a.txt');
    const b = path.join(tmpDir, 'b.txt');
    await fs.writeFile(a, 'same');
    await fs.writeFile(b, 'same');

    expect(await fileHash(a)).toBe(await fileHash(b));
  });

  it('returns different hashes for files with different content', async () => {
    const a = path.join(tmpDir, 'a.txt');
    const b = path.join(tmpDir, 'b.txt');
    await fs.writeFile(a, 'content-a');
    await fs.writeFile(b, 'content-b');

    expect(await fileHash(a)).not.toBe(await fileHash(b));
  });

  it('returns null for a non-existent file', async () => {
    expect(await fileHash(path.join(tmpDir, 'missing.txt'))).toBeNull();
  });
});

describe('filesAreDifferent', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aidk-fs-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('returns false for files with identical content', async () => {
    const a = path.join(tmpDir, 'a.txt');
    const b = path.join(tmpDir, 'b.txt');
    await fs.writeFile(a, 'same');
    await fs.writeFile(b, 'same');

    expect(await filesAreDifferent(a, b)).toBe(false);
  });

  it('returns true for files with different content', async () => {
    const a = path.join(tmpDir, 'a.txt');
    const b = path.join(tmpDir, 'b.txt');
    await fs.writeFile(a, 'alpha');
    await fs.writeFile(b, 'beta');

    expect(await filesAreDifferent(a, b)).toBe(true);
  });

  it('returns true when one file is missing', async () => {
    const a = path.join(tmpDir, 'a.txt');
    const missing = path.join(tmpDir, 'missing.txt');
    await fs.writeFile(a, 'data');

    expect(await filesAreDifferent(a, missing)).toBe(true);
  });
});

describe('listFiles', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aidk-fs-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('returns sorted relative paths for all files in a directory', async () => {
    await fs.writeFile(path.join(tmpDir, 'b.txt'), 'b');
    await fs.writeFile(path.join(tmpDir, 'a.txt'), 'a');
    await fs.ensureDir(path.join(tmpDir, 'sub'));
    await fs.writeFile(path.join(tmpDir, 'sub', 'c.txt'), 'c');

    const files = await listFiles(tmpDir);
    expect(files).toEqual(['a.txt', 'b.txt', path.join('sub', 'c.txt')]);
  });

  it('returns an empty array for a non-existent directory', async () => {
    const missing = path.join(tmpDir, 'no-such-dir');
    expect(await listFiles(missing)).toEqual([]);
  });

  it('returns an empty array for an empty directory', async () => {
    const empty = path.join(tmpDir, 'empty');
    await fs.ensureDir(empty);
    expect(await listFiles(empty)).toEqual([]);
  });
});
