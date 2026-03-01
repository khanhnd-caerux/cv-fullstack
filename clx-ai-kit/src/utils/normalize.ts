import type { ComponentType } from '../types.js';
import { COMPONENT_TYPES } from '../types.js';

const PLURAL_MAP: Record<string, ComponentType> = {
  skills: 'skill',
  commands: 'command',
  rules: 'rule',
  phases: 'phase',
};

export function normalizeType(input: string): ComponentType | null {
  const lower = input.toLowerCase();
  if (COMPONENT_TYPES.includes(lower as ComponentType)) {
    return lower as ComponentType;
  }
  return PLURAL_MAP[lower] ?? null;
}
