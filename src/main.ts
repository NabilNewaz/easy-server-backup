#!/usr/bin/env node

import 'reflect-metadata';
import { program } from 'commander';
import { ValidateConfigCliCommand } from './commands/validate-config/ValidateConfigCliCommand';
import { BackupCliCommand } from './commands/backup/BackupCliCommand';
import { CronCliCommand } from './commands/cron/CronCliCommand';
import { setRootDir } from './util/rootDir';

setRootDir(`${__dirname}/..`);

program.description('Easy backup');

new ValidateConfigCliCommand(program);
new BackupCliCommand(program);
new CronCliCommand(program);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.helpInformation();
}
