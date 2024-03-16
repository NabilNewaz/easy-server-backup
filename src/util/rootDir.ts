let rootDir = '';

export const getRootDir = (): string => {
  if (rootDir.length === 0)
    throw new Error('rootDir used before initialization');

  return rootDir;
};

export const setRootDir = (path: string): void => {
  rootDir = path;
};
