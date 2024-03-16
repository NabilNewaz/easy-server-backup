import { spawnSync } from 'child_process';
import { createLogger } from './CreateLogger';

const logger = createLogger('Compressor');

export const compress = ({
  inputAbsoluteFilePath,
  outputAbsoluteFilePath
}: {
  inputAbsoluteFilePath: string;
  outputAbsoluteFilePath: string;
}): string => {
  const compressedOutputFilePath = `${outputAbsoluteFilePath}.zip`;

  const compressProcess = spawnSync('zip', [
    '-r',
    compressedOutputFilePath,
    inputAbsoluteFilePath
  ]);

  const output = String(compressProcess.output);

  if (compressProcess.status === 1 || output.includes('zip warning')) {
    logger.errorImportant(`Zip backup process failed...`);

    throw new Error(output);
  } else {
    logger.success('Zip backup process success');
  }

  return compressedOutputFilePath;
};
