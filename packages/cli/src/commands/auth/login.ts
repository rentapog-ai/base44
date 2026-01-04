import { Command } from 'commander';

export const loginCommand = new Command('login')
  .description('Authenticate with Base44')
  .action(async () => {
    console.log('Login action - not yet implemented');
  });

