import path from 'node:path';
import fs from 'fs-extra';
import type { ComponentMeta, ComponentType } from '../types.js';
import { cursorTemplatesDir, claudeCodeTemplatesDir, docsTemplatesDir } from '../utils/paths.js';

async function extractDescription(skillDir: string): Promise<string> {
  const skillFile = path.join(skillDir, 'SKILL.md');
  const exists = await fs.pathExists(skillFile);
  if (!exists) return '';

  const content = await fs.readFile(skillFile, 'utf-8');
  const descMatch = content.match(/^description:\s*>?\s*\n?\s*(.+)/m);
  if (descMatch) return descMatch[1].trim();

  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
      return trimmed.slice(0, 100);
    }
  }
  return '';
}

async function extractCommandDescription(filePath: string): Promise<string> {
  const exists = await fs.pathExists(filePath);
  if (!exists) return '';

  const content = await fs.readFile(filePath, 'utf-8');
  const descMatch = content.match(/^description:\s*(.+)/m);
  return descMatch ? descMatch[1].trim() : '';
}

async function extractRuleName(filePath: string): Promise<string> {
  const basename = path.basename(filePath);
  return basename.replace(/\.(mdc|md)$/, '');
}

async function scanSkills(baseDir: string): Promise<ComponentMeta[]> {
  const components: ComponentMeta[] = [];
  const skillsDir = path.join(baseDir, 'skills');
  if (await fs.pathExists(skillsDir)) {
    const skills = await fs.readdir(skillsDir, { withFileTypes: true });
    for (const skill of skills) {
      if (!skill.isDirectory()) continue;
      const description = await extractDescription(path.join(skillsDir, skill.name));
      components.push({
        name: skill.name,
        description,
        type: 'skill',
        templatePath: path.join(skillsDir, skill.name),
      });
    }
  }
  return components;
}

async function scanCommands(baseDir: string): Promise<ComponentMeta[]> {
  const components: ComponentMeta[] = [];
  const commandsDir = path.join(baseDir, 'commands');
  if (await fs.pathExists(commandsDir)) {
    const commands = await fs.readdir(commandsDir);
    for (const cmd of commands) {
      if (!cmd.endsWith('.md')) continue;
      const name = cmd.replace('.md', '');
      const description = await extractCommandDescription(path.join(commandsDir, cmd));
      components.push({
        name,
        description,
        type: 'command',
        templatePath: path.join(commandsDir, cmd),
      });
    }
  }
  return components;
}

async function scanRules(baseDir: string): Promise<ComponentMeta[]> {
  const components: ComponentMeta[] = [];
  const rulesDir = path.join(baseDir, 'rules');
  if (await fs.pathExists(rulesDir)) {
    const rules = await fs.readdir(rulesDir);
    for (const rule of rules) {
      if (!rule.endsWith('.mdc') && !rule.endsWith('.md')) continue;
      const name = await extractRuleName(path.join(rulesDir, rule));
      components.push({
        name,
        description: '',
        type: 'rule',
        templatePath: path.join(rulesDir, rule),
      });
    }
  }
  return components;
}

export async function loadRegistry(): Promise<ComponentMeta[]> {
  const componentsMap = new Map<string, ComponentMeta>();

  // Helper to add components, preferring the first one added if duplicates
  const addComponents = (items: ComponentMeta[]) => {
    for (const item of items) {
      const key = `${item.type}:${item.name}`;
      if (!componentsMap.has(key)) {
        componentsMap.set(key, item);
      }
    }
  };

  // Scan Cursor templates
  addComponents(await scanSkills(cursorTemplatesDir()));
  addComponents(await scanCommands(cursorTemplatesDir()));
  addComponents(await scanRules(cursorTemplatesDir()));

  // Scan Claude Code templates
  addComponents(await scanSkills(claudeCodeTemplatesDir()));
  addComponents(await scanCommands(claudeCodeTemplatesDir()));
  addComponents(await scanRules(claudeCodeTemplatesDir()));

  // Scan Phase docs
  const docsDir = docsTemplatesDir();
  if (await fs.pathExists(docsDir)) {
    const phases = await fs.readdir(docsDir, { withFileTypes: true });
    for (const phase of phases) {
      if (!phase.isDirectory()) continue;
      addComponents([{
        name: phase.name,
        description: `${phase.name} documentation phase`,
        type: 'phase',
        templatePath: path.join(docsDir, phase.name),
      }]);
    }
  }

  return Array.from(componentsMap.values());
}

export function filterByType(
  registry: readonly ComponentMeta[],
  type: ComponentType,
): ComponentMeta[] {
  return registry.filter((c) => c.type === type);
}

export function findComponent(
  registry: readonly ComponentMeta[],
  type: ComponentType,
  name: string,
): ComponentMeta | undefined {
  return registry.find((c) => c.type === type && c.name === name);
}
