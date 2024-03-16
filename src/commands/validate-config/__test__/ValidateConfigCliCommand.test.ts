import { program } from 'commander';

import { ValidateConfigCliCommand } from '../ValidateConfigCliCommand';

test('must validate mongo backup engine params', async () => {
  const command = new ValidateConfigCliCommand(program);

  await command.validateEngine({
    type: 'mongo',
    backupName: 'test',
    databaseUrl: 'mongodb://localhost:27017'
  });
});

test('must validate file backup engine params', async () => {
  const command = new ValidateConfigCliCommand(program);

  await command.validateEngine({
    type: 'file',
    path: 'foo'
  });
});
