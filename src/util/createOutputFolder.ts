import * as fs from 'fs';

export const createOutputFolder = (directory: string): void => {
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);
};
