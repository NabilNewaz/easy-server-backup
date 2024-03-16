import * as yup from 'yup';

export type FileBackupEngineConfig = {
  type: 'file';
  backupName: string;
  path: string;
};

export const FileBackupEngineConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('file')),
  backupName: yup.string().required(),
  path: yup.string().required()
});
