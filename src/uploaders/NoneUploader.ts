import { NoneUploaderConfig } from '../commands/validate-config/configs/uploaders/NoneUploaderConfig';
import { Uploader } from './Uploader';
import { createLogger } from '../util/CreateLogger';

const logger = createLogger('NoneUploader');

export class NoneUploader extends Uploader<NoneUploaderConfig> {
  async upload(absoluteFilePath: string): Promise<void> {
    logger.success(`Your backup is ${absoluteFilePath}`);
  }
}
