import * as fs from 'fs';

export const cleanup = (directory: string): void => {
  fs.rmSync(`${directory}/`, {
    recursive: true
  });
};
