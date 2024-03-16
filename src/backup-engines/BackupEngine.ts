import { ValidBackupEngineConfig } from '../commands/validate-config/configs/engines/ValidBackupEngineConfig';

export abstract class BackupEngine<
  T extends ValidBackupEngineConfig = ValidBackupEngineConfig
> {
  constructor(protected readonly config: T) {}

  abstract buildBackup(outputDir: string): string;
}
