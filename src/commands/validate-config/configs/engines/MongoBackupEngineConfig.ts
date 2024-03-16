import * as yup from 'yup';

export type MongoBackupEngineConfig = {
  type: 'mongo';
  backupName: string;
  databaseUrl: string;
};

export const MongoBackupEngineConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('mongo')),
  backupName: yup.string().required(),
  databaseUrl: yup.string().required()
});
