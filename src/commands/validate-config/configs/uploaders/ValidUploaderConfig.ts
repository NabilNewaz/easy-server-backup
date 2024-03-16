import { GoogleCloudStorageUploaderConfig } from './GoogleCloudStorageUploaderConfig';
import { NoneUploaderConfig } from './NoneUploaderConfig';

export type ValidUploaderConfig =
  | GoogleCloudStorageUploaderConfig
  | NoneUploaderConfig;
