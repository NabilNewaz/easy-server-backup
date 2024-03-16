import { BackupEngine } from './BackupEngine';
import { FileBackupEngineConfig } from '../commands/validate-config/configs/engines/FileBackupEngineConfig';
import { compress } from '../util/compress';
import { getDateBasedFilename } from '../util/getDateBasedFilename';

export class FileBackupEngine extends BackupEngine<FileBackupEngineConfig> {
  buildBackup(outputDir: string): string {
    const compressOutputFilePath = getDateBasedFilename(
      `${outputDir}/${this.config.backupName}`
    );
    return compress({
      inputAbsoluteFilePath: this.config.path,
      outputAbsoluteFilePath: compressOutputFilePath
    });
  }
}
