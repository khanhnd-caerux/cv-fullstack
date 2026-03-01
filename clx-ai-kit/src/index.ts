import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { removeCommand } from './commands/remove.js';
import { listCommand } from './commands/list.js';
import { updateCommand } from './commands/update.js';
import { VERSION } from './version.js';

const program = new Command()
  .name('aidk')
  .description(
    'Scaffold AI-assisted development structures for Cursor, Antigravity, and Claude Code',
  )
  .version(VERSION)
  .showHelpAfterError(true);

program
  .command('init')
  .description('Initialize AI DevKit in the current project')
  .option('--force', 'Overwrite existing configuration')
  .action((options) => initCommand(options));

program
  .command('add')
  .description('Add a component (skill, command, rule, phase)')
  .argument('<type>', 'Component type: skill | command | rule | phase')
  .argument('<name>', 'Component name')
  .action((type, name) => addCommand(type, name));

program
  .command('remove')
  .description('Remove a component (skill, command, rule, phase)')
  .argument('<type>', 'Component type: skill | command | rule | phase')
  .argument('<name>', 'Component name')
  .action((type, name) => removeCommand(type, name));

program
  .command('list')
  .description('List available and installed components')
  .argument('[type]', 'Filter by type: skill | command | rule | phase')
  .action((type) => listCommand(type));

program
  .command('update')
  .description('Update components to latest bundled versions')
  .action(() => updateCommand());

program.parse();
