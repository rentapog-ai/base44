import { Command } from 'commander';

export const whoamiCommand = new Command('whoami')
  .description('Display current authenticated user')
  .action(async () => {
    console.log('Whoami action - not yet implemented');
  });

