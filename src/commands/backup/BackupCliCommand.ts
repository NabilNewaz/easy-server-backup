import { CliCommand } from '../CliCommand';
import { Command } from 'commander';
import { ValidateConfigCliCommand } from '../validate-config/ValidateConfigCliCommand';
import { createLogger } from '../../util/CreateLogger';
import { Container } from 'typedi';
import { BackupEngine } from '../../backup-engines/BackupEngine';
import { FileBackupEngine } from '../../backup-engines/FileBackupEngine';
import { MongoBackupEngine } from '../../backup-engines/MongoBackupEngine';
import { ValidConfig } from '../validate-config/configs/ValidConfig';
import { Notificator } from '../../notificators/Notificator';
import { TelegramNotificator } from '../../notificators/TelegramNotificator';
import { ConsoleNotificator } from '../../notificators/ConsoleNotificator';
import { Uploader } from '../../uploaders/Uploader';
import { GoogleCloudStorageUploader } from '../../uploaders/GoogleCloudStorageUploader';
import { cleanup } from '../../util/cleanup';
import { createOutputFolder } from '../../util/createOutputFolder';
import { CliParams } from '../CliParams';
import { NoneUploader } from '../../uploaders/NoneUploader';

const logger = createLogger('BackupCli');

export class BackupCliCommand extends CliCommand<ValidConfig> {
  createCommand(): Command {
    const command = this.program.command('backup');

    command.action(async (params) => {
      Container.set<CliParams>('params', params);

      const validator = new ValidateConfigCliCommand(this.program);

      const config = await validator.validate(params);

      await this.execute(config);
    });

    return command;
  }

  async execute(config: ValidConfig): Promise<void> {
    logger.successImportant('Detected the following config');
    logger.successImportant(
      JSON.stringify(
        {
          engine: config.engine.type,
          notificator: config.notificator.type,
          uploader: config.uploader.type
        },
        null,
        2
      )
    );

    this.registerContainer(config);

    await this.backup(config);
  }

  protected registerContainer(config: ValidConfig) {
    switch (config.engine.type) {
      case 'file':
        Container.set<BackupEngine>(
          'engine',
          new FileBackupEngine(config.engine)
        );
        break;
      case 'mongo':
        Container.set<BackupEngine>(
          'engine',
          new MongoBackupEngine(config.engine)
        );
        break;
    }

    switch (config.notificator.type) {
      case 'telegram':
        Container.set<Notificator>(
          'notificator',
          new TelegramNotificator(config.notificator)
        );
        break;
      case 'console':
        Container.set<Notificator>(
          'notificator',
          new ConsoleNotificator(config.notificator)
        );
        break;
    }

    switch (config.uploader.type) {
      case 'gcp':
        Container.set<Uploader>(
          'uploader',
          new GoogleCloudStorageUploader(config.uploader)
        );
        break;
      case 'none':
        Container.set<Uploader>('uploader', new NoneUploader(config.uploader));
        break;
    }
  }

  protected async backup(config: ValidConfig) {
    const backupEngine = Container.get<BackupEngine>('engine');
    const uploader = Container.get<Uploader>('uploader');
    const notificator = Container.get<Notificator>('notificator');

    try {
      cleanup(config.outputDir);

      createOutputFolder(config.outputDir);

      const backupFilePath = backupEngine.buildBackup(config.outputDir);

      await uploader.upload(backupFilePath);

      await notificator.notify(config.notificator.successMessage);

      if (config.uploader.type !== 'none') {
        cleanup(config.outputDir);
        createOutputFolder(config.outputDir)
      }
    } catch (e) {
      await notificator.notify(`${config.notificator.errorMessage}: ${e}`);
    }
  }
}
