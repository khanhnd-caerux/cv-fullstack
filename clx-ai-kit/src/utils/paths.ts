import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function templatesDir(): string {
  return path.resolve(__dirname, '..', 'templates');
}

export function cursorTemplatesDir(): string {
  return path.join(templatesDir(), 'cursor');
}

export function docsTemplatesDir(): string {
  return path.join(templatesDir(), 'docs');
}

export function claudeCodeTemplatesDir(): string {
  return path.join(templatesDir(), 'claude-code');
}

export function sharedTemplatesDir(): string {
  return path.join(templatesDir(), 'shared');
}
