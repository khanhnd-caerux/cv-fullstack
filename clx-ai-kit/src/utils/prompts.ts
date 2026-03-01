import * as p from '@clack/prompts';
import pc from 'picocolors';

export function handleCancel(value: unknown): asserts value {
  if (p.isCancel(value)) {
    p.cancel('Operation cancelled.');
    process.exit(2);
  }
}

export function intro(message: string): void {
  p.intro(pc.bgCyan(pc.black(` ${message} `)));
}

export function outro(message: string): void {
  p.outro(pc.green(message));
}

export function warn(message: string): void {
  p.log.warn(pc.yellow(message));
}

export function error(message: string): void {
  p.log.error(pc.red(message));
}

export function info(message: string): void {
  p.log.info(message);
}

export function success(message: string): void {
  p.log.success(pc.green(message));
}

export function step(message: string): void {
  p.log.step(message);
}
