import { ValidBackupEngineConfig } from './engines/ValidBackupEngineConfig';
import { ValidNotificatorConfig } from './notification/ValidNotificatorConfig';
import { ValidUploaderConfig } from './uploaders/ValidUploaderConfig';
import * as yup from 'yup';

export type ValidConfig = {
  cron?: string;
  outputDir: string;
  engine: ValidBackupEngineConfig;
  notificator: ValidNotificatorConfig;
  uploader: ValidUploaderConfig;
};

export const ValidConfigSchema = (withCron: boolean) => {
  let cronValidator = yup.string();

  if (withCron) {
    cronValidator = cronValidator.required();
  }

  return yup.object().shape({
    cron: cronValidator,
    outputDir: yup.string().required()
  });
};
