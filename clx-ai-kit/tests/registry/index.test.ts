import { describe, it, expect } from 'vitest';
import { filterByType, findComponent } from '../../src/registry/index.js';
import type { ComponentMeta } from '../../src/types.js';

const registry: ComponentMeta[] = [
  { name: 'skill-a', description: 'Skill A', type: 'skill', templatePath: '/skills/skill-a' },
  { name: 'skill-b', description: 'Skill B', type: 'skill', templatePath: '/skills/skill-b' },
  { name: 'cmd-a', description: 'Command A', type: 'command', templatePath: '/commands/cmd-a.md' },
  { name: 'rule-a', description: '', type: 'rule', templatePath: '/rules/rule-a.mdc' },
  { name: 'requirements', description: 'requirements documentation phase', type: 'phase', templatePath: '/docs/requirements' },
];

describe('filterByType', () => {
  it('returns only skills', () => {
    const result = filterByType(registry, 'skill');
    expect(result).toHaveLength(2);
    expect(result.every((c) => c.type === 'skill')).toBe(true);
  });

  it('returns only commands', () => {
    const result = filterByType(registry, 'command');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('cmd-a');
  });

  it('returns only rules', () => {
    const result = filterByType(registry, 'rule');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('rule-a');
  });

  it('returns only phases', () => {
    const result = filterByType(registry, 'phase');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('requirements');
  });

  it('returns empty array when no matching type', () => {
    expect(filterByType([], 'skill')).toEqual([]);
  });
});

describe('findComponent', () => {
  it('finds a component by type and name', () => {
    const result = findComponent(registry, 'skill', 'skill-a');
    expect(result).toBeDefined();
    expect(result!.name).toBe('skill-a');
    expect(result!.type).toBe('skill');
  });

  it('returns undefined for a non-existent name', () => {
    expect(findComponent(registry, 'skill', 'missing')).toBeUndefined();
  });

  it('returns undefined when type does not match', () => {
    expect(findComponent(registry, 'command', 'skill-a')).toBeUndefined();
  });

  it('returns undefined for an empty registry', () => {
    expect(findComponent([], 'skill', 'any')).toBeUndefined();
  });
});
