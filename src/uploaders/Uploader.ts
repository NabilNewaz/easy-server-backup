import { ValidUploaderConfig } from '../commands/validate-config/configs/uploaders/ValidUploaderConfig';

export abstract class Uploader<
  T extends ValidUploaderConfig = ValidUploaderConfig
> {
  constructor(protected readonly config: T) {}

  abstract upload(absoluteFilePath: string): Promise<void>;
}
