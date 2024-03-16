import * as fs from 'fs';
import { google } from 'googleapis';
import { Container } from 'typedi';
import { CliParams } from '../commands/CliParams';
import { createLogger } from '../util/CreateLogger';
import { Uploader } from './Uploader';
import { GoogleCloudStorageUploaderConfig } from '../commands/validate-config/configs/uploaders/GoogleCloudStorageUploaderConfig';

const logger = createLogger('GoogleDriveUploader');

export class GoogleCloudStorageUploader extends Uploader<GoogleCloudStorageUploaderConfig> {
  async upload(absoluteFilePath: string): Promise<void> {
    const params = Container.get<CliParams>('params');

    if (params.dry) {
      logger.warn('Dry execution: skipping backup upload');
      return;
    }

    const keyFile = require(this.config.storageKeyPath);

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const filename = absoluteFilePath.split('/').pop();

    const fileMetadata = {
      name: `${filename}`,
      mimeType: 'application/zip',
      parents: this.config.backupsFoldersId
    };

    const media = {
      mimeType: 'application/zip',
      body: fs.createReadStream(absoluteFilePath),
    };

    try {
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });

      logger.success(`File uploaded with ID: ${response.data.id}`);
    } catch (error) {
      logger.error(`Error uploading file: ${error}`);
    }
  }
}
