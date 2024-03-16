import { MongoBackupEngineConfig } from './MongoBackupEngineConfig';
import { FileBackupEngineConfig } from './FileBackupEngineConfig';

export type ValidBackupEngineConfig = MongoBackupEngineConfig | FileBackupEngineConfig;
