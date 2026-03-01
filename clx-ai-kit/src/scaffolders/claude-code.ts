import path from 'node:path';
import type { ComponentMeta, ComponentType } from '../types.js';
import { copyDirectory, copyFile, removeFileOrDir } from '../utils/fs.js';
import { claudeCodeTemplatesDir } from '../utils/paths.js';

const TYPE_DIR_MAP: Record<Exclude<ComponentType, 'phase'>, string> = {
    skill: '.claude/skills',
    command: '.claude/commands',
    rule: '.claude/rules',
};

export function claudeCodeTargetPath(
    cwd: string,
    type: ComponentType,
    name: string,
): string {
    if (type === 'phase') return path.join(cwd, 'docs', 'ai', name);

    const dir = TYPE_DIR_MAP[type];
    if (type === 'skill') return path.join(cwd, dir, name);
    return path.join(cwd, dir, `${name}.md`);
}

export async function scaffoldClaudeCodeComponent(
    cwd: string,
    component: ComponentMeta,
): Promise<void> {
    const target = claudeCodeTargetPath(cwd, component.type, component.name);

    if (component.type === 'phase') {
        await copyDirectory(component.templatePath, target);
        return;
    }

    const typeDirs: Record<string, string> = {
        skill: 'skills',
        command: 'commands',
        rule: 'rules',
    };

    const filename = component.type === 'skill' ? component.name : `${component.name}.md`;
    const sourcePath = path.join(
        claudeCodeTemplatesDir(),
        typeDirs[component.type],
        filename
    );

    if (component.type === 'skill') {
        await copyDirectory(sourcePath, target);
        return;
    }

    await copyFile(sourcePath, target);
}

export async function removeClaudeCodeComponent(
    cwd: string,
    type: ComponentType,
    name: string,
): Promise<void> {
    const target = claudeCodeTargetPath(cwd, type, name);
    await removeFileOrDir(target);
}
