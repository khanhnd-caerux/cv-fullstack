import { describe, it, expect } from 'vitest';
import { normalizeType } from '../../src/utils/normalize.js';

describe('normalizeType', () => {
  it('returns singular types as-is', () => {
    expect(normalizeType('skill')).toBe('skill');
    expect(normalizeType('command')).toBe('command');
    expect(normalizeType('rule')).toBe('rule');
    expect(normalizeType('phase')).toBe('phase');
  });

  it('maps plural forms to singular', () => {
    expect(normalizeType('skills')).toBe('skill');
    expect(normalizeType('commands')).toBe('command');
    expect(normalizeType('rules')).toBe('rule');
    expect(normalizeType('phases')).toBe('phase');
  });

  it('normalizes input to lowercase before matching', () => {
    expect(normalizeType('SKILL')).toBe('skill');
    expect(normalizeType('Skills')).toBe('skill');
    expect(normalizeType('COMMANDS')).toBe('command');
  });

  it('returns null for unknown types', () => {
    expect(normalizeType('unknown')).toBeNull();
    expect(normalizeType('')).toBeNull();
    expect(normalizeType('templates')).toBeNull();
  });
});
