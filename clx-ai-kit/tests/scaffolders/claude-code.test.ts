import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'node:path';
import {
    claudeCodeTargetPath,
    scaffoldClaudeCodeComponent,
    removeClaudeCodeComponent,
} from '../../src/scaffolders/claude-code.js';
import * as fsUtils from '../../src/utils/fs.js';
import * as pathsUtils from '../../src/utils/paths.js';

vi.mock('../../src/utils/fs.js', () => ({
    copyDirectory: vi.fn(),
    copyFile: vi.fn(),
    removeFileOrDir: vi.fn(),
}));

vi.mock('../../src/utils/paths.js', () => ({
    claudeCodeTemplatesDir: vi.fn(() => '/mock/templates/claude-code'),
    sharedTemplatesDir: vi.fn(() => '/mock/templates/shared'),
    cursorTemplatesDir: vi.fn(() => '/mock/templates/cursor'),
    docsTemplatesDir: vi.fn(() => '/mock/templates/docs'),
    templatesDir: vi.fn(() => '/mock/templates'),
}));

describe('claude-code scaffolder', () => {
    const cwd = '/mock/project';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('claudeCodeTargetPath', () => {
        it('should correctly resolve skill target path', () => {
            const target = claudeCodeTargetPath(cwd, 'skill', 'my-skill');
            expect(target).toBe(path.join(cwd, '.claude/skills/my-skill'));
        });

        it('should correctly resolve command target path', () => {
            const target = claudeCodeTargetPath(cwd, 'command', 'my-command');
            expect(target).toBe(path.join(cwd, '.claude/commands/my-command.md'));
        });

        it('should correctly resolve rule target path', () => {
            const target = claudeCodeTargetPath(cwd, 'rule', 'my-rule');
            expect(target).toBe(path.join(cwd, '.claude/rules/my-rule.md'));
        });

        it('should correctly resolve phase target path', () => {
            const target = claudeCodeTargetPath(cwd, 'phase', 'my-phase');
            expect(target).toBe(path.join(cwd, 'docs/ai/my-phase'));
        });
    });

    describe('scaffoldClaudeCodeComponent', () => {
        it('should copy directory for skills', async () => {
            await scaffoldClaudeCodeComponent(cwd, {
                type: 'skill',
                name: 'test-skill',
                description: 'test',
                templatePath: '/mock/registry/skill/test-skill',
            });

            expect(fsUtils.copyDirectory).toHaveBeenCalledWith(
                path.join('/mock/templates/claude-code/skills/test-skill'),
                path.join(cwd, '.claude/skills/test-skill'),
            );
        });

        it('should copy file for commands', async () => {
            await scaffoldClaudeCodeComponent(cwd, {
                type: 'command',
                name: 'test-command',
                description: 'test',
                templatePath: '/mock/registry/command/test-command.md',
            });

            expect(fsUtils.copyFile).toHaveBeenCalledWith(
                path.join('/mock/templates/claude-code/commands/test-command.md'),
                path.join(cwd, '.claude/commands/test-command.md'),
            );
        });

        it('should copy file for rules', async () => {
            await scaffoldClaudeCodeComponent(cwd, {
                type: 'rule',
                name: '0-test-rule',
                description: 'test',
                templatePath: '/mock/registry/rule/0-test-rule.md',
            });

            expect(fsUtils.copyFile).toHaveBeenCalledWith(
                path.join('/mock/templates/claude-code/rules/0-test-rule.md'),
                path.join(cwd, '.claude/rules/0-test-rule.md'),
            );
        });

        it('should copy directory for phases', async () => {
            await scaffoldClaudeCodeComponent(cwd, {
                type: 'phase',
                name: 'test-phase',
                description: 'test',
                templatePath: '/mock/registry/phase/test-phase',
            });

            // For phase, it uses the component's original template path since phase docs aren't per-environment
            expect(fsUtils.copyDirectory).toHaveBeenCalledWith(
                '/mock/registry/phase/test-phase',
                path.join(cwd, 'docs/ai/test-phase'),
            );
        });
    });

    describe('removeClaudeCodeComponent', () => {
        it('should call removeFileOrDir with correct skill path', async () => {
            await removeClaudeCodeComponent(cwd, 'skill', 'test-skill');
            expect(fsUtils.removeFileOrDir).toHaveBeenCalledWith(
                path.join(cwd, '.claude/skills/test-skill'),
            );
        });

        it('should call removeFileOrDir with correct command path', async () => {
            await removeClaudeCodeComponent(cwd, 'command', 'test-command');
            expect(fsUtils.removeFileOrDir).toHaveBeenCalledWith(
                path.join(cwd, '.claude/commands/test-command.md'),
            );
        });
    });
});
