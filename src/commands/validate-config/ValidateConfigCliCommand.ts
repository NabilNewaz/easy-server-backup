import { CliCommand } from '../CliCommand';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import {
  MongoBackupEngineConfig,
  MongoBackupEngineConfigSchema
} from './configs/engines/MongoBackupEngineConfig';
import {
  FileBackupEngineConfig,
  FileBackupEngineConfigSchema
} from './configs/engines/FileBackupEngineConfig';
import { ValidationError } from 'yup';
import { createLogger } from '../../util/CreateLogger';
import { ValidBackupEngineConfig } from './configs/engines/ValidBackupEngineConfig';
import { ValidConfig, ValidConfigSchema } from './configs/ValidConfig';
import {
  ConsoleNotificatorConfig,
  ConsoleNotificatorConfigSchema
} from './configs/notification/ConsoleNotificationConfig';
import { ValidNotificatorConfig } from './configs/notification/ValidNotificatorConfig';
import { ValidUploaderConfig } from './configs/uploaders/ValidUploaderConfig';
import {
  TelegramNotificatorConfig,
  TelegramNotificatorConfigSchema
} from './configs/notification/TelegramNotificatorConfig';
import {
  GoogleCloudStorageUploaderConfig,
  GoogleCloudStorageUploaderConfigSchema
} from './configs/uploaders/GoogleCloudStorageUploaderConfig';
import { NoneUploaderConfigSchema } from './configs/uploaders/NoneUploaderConfig';

const logger = createLogger('ConfigValidator');

const validUploaderConfigTypes = ['gcp', 'none'];
const validNotificatorConfigTypes = ['telegram', 'console'];
const validEngineConfigTypes = ['mongo', 'file'];

export type ValidateConfigCliParams = { file?: string };

export class ValidateConfigCliCommand extends CliCommand<ValidateConfigCliParams> {
  createCommand(): Command {
    const command = this.program.command('validate');

    command.action((params) => this.execute(params));

    return command;
  }

  async execute(params: ValidateConfigCliParams): Promise<void> {
    const validConfig = await this.validate(params);

    logger.successImportant('Detected the following config');
    logger.successImportant(
      JSON.stringify({
        engine: validConfig.engine.type,
        notificator: validConfig.notificator.type,
        uploader: validConfig.uploader.type
      })
    );

    logger.successImportant('Your backup config file is valid ✨');
  }

  throwError(msg: string, e?: unknown): void {
    logger.errorImportant(msg);

    if (e) {
      console.error(e);
    }

    throw Error(msg);
  }

  async validateEngine(
    rawConfig: Partial<ValidConfig['engine']>
  ): Promise<ValidBackupEngineConfig> {
    const validTypes = validEngineConfigTypes;

    if (
      typeof rawConfig !== 'object' ||
      typeof rawConfig.type !== 'string' ||
      !validTypes.includes(rawConfig.type)
    ) {
      this.throwError(
        `Configuration field "engine.type" is not a valid string. Valid values: ${validTypes.join(
          ', '
        )}`
      );
    }

    try {
      if (rawConfig.type === 'mongo') {
        const validation = await MongoBackupEngineConfigSchema.validate(
          rawConfig
        );

        return (validation as unknown) as MongoBackupEngineConfig;
      } else if (rawConfig.type === 'file') {
        const validation = await FileBackupEngineConfigSchema.validate(
          rawConfig
        );

        return (validation as unknown) as FileBackupEngineConfig;
      } else {
        this.throwError('Unknown backup engine');
        process.exit(1);
      }
    } catch (e) {
      logger.errorImportant('Invalid backup engine config ❌');

      if (e instanceof ValidationError) {
        e.errors.forEach((e) => logger.errorImportant(e));
      } else {
        logger.error('Reason: unknown');
        logger.error(e);
      }

      process.exit(1);
    }
  }

  async validateNotificator(
    rawConfig: Partial<ValidConfig['notificator']>
  ): Promise<ValidNotificatorConfig> {
    const validTypes = validNotificatorConfigTypes;

    if (
      typeof rawConfig !== 'object' ||
      typeof rawConfig.type !== 'string' ||
      !validTypes.includes(rawConfig.type)
    ) {
      this.throwError(
        `Configuration field "notificator.type" is not a valid string. Valid values: ${validTypes.join(
          ', '
        )}`
      );
    }

    try {
      if (rawConfig.type === 'telegram') {
        const validation = await TelegramNotificatorConfigSchema.validate(
          rawConfig
        );

        return (validation as unknown) as TelegramNotificatorConfig;
      } else if (rawConfig.type === 'console') {
        const validation = await ConsoleNotificatorConfigSchema.validate(
          rawConfig
        );

        return (validation as unknown) as ConsoleNotificatorConfig;
      } else {
        this.throwError('Unknown notificator');
        process.exit(1);
      }
    } catch (e) {
      logger.errorImportant('Invalid notificator config ❌');

      if (e instanceof ValidationError) {
        e.errors.forEach((e) => logger.errorImportant(e));
      } else {
        logger.error('Reason: unknown');
        logger.error(e);
      }

      process.exit(1);
    }
  }

  async validateUploader(
    rawConfig: Partial<ValidConfig['uploader']>
  ): Promise<ValidUploaderConfig> {
    const validTypes = validUploaderConfigTypes;

    if (
      typeof rawConfig !== 'object' ||
      typeof rawConfig.type !== 'string' ||
      !validTypes.includes(rawConfig.type)
    ) {
      this.throwError(
        `Configuration field "uploader.type" is not a valid string. Valid values: ${validTypes.join(
          ', '
        )}`
      );
    }

    try {
      let validator:
        | typeof GoogleCloudStorageUploaderConfigSchema
        | typeof NoneUploaderConfigSchema
        | undefined;

      switch (rawConfig.type) {
        case 'gcp':
          validator = GoogleCloudStorageUploaderConfigSchema;
          break;
        case 'none':
          validator = NoneUploaderConfigSchema;
          break;
      }

      if (!validator) {
        this.throwError('Unknown uploader');
        process.exit(1);
      }

      const validation = await validator.validate(rawConfig);

      return validation as ValidUploaderConfig;
    } catch (e) {
      logger.errorImportant('Invalid uploader config ❌');

      if (e instanceof ValidationError) {
        e.errors.forEach((e) => logger.errorImportant(e));
      } else {
        logger.error('Reason: unknown');
        logger.error(e);
      }

      process.exit(1);
    }
  }

  async validate(
    params: ValidateConfigCliParams,
    options: { cron: boolean } = { cron: false }
  ): Promise<ValidConfig> {
    let configPath = params.file;

    if (typeof configPath !== 'string') {
      configPath = `./backup.config.json`;
    }

    let file: string;

    try {
      file = readFileSync(configPath, { encoding: 'utf8' });
    } catch {
      this.throwError(`${configPath} do not exist`);
    }

    let rawConfig: Partial<ValidConfig>;

    try {
      rawConfig = JSON.parse(file);
    } catch (e) {
      if (e instanceof SyntaxError) {
        this.throwError(`${configPath} is not a valid JSON`);
      } else {
        this.throwError(`Unknown error parsing file`, e);
      }
    }

    try {
      const config = await ValidConfigSchema(options.cron).validate(rawConfig);

      const engine = await this.validateEngine(rawConfig.engine);
      const notificator = await this.validateNotificator(rawConfig.notificator);
      const uploader = await this.validateUploader(rawConfig.uploader);

      return { ...config, engine, notificator, uploader };
    } catch (e) {
      logger.errorImportant('Invalid config ❌');

      if (e instanceof ValidationError) {
        e.errors.forEach((e) => logger.errorImportant(e));
      } else {
        logger.error('Reason: unknown');
        logger.error(e);
      }

      process.exit(1);
    }
  }
}
