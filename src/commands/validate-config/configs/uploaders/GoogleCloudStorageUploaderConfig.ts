import * as yup from 'yup';

export type GoogleCloudStorageUploaderConfig = {
  type: 'gcp';
  storageKeyPath: string;
  backupsFoldersId: Array<string>;
};

export const GoogleCloudStorageUploaderConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('gcp')),
  storageKeyPath: yup.string().required(),
  backupsFoldersId: yup.array().required()
});
