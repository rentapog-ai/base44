import { Command } from 'commander';

export const logoutCommand = new Command('logout')
  .description('Logout from current device')
  .action(async () => {
    console.log('Logout action - not yet implemented');
  });

