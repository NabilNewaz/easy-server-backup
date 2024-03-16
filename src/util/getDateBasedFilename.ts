const formatDigit = (digit: number): string => `${digit}`.padStart(2, '0');

export const getDateBasedFilename = (basename: string): string => {
  const now = new Date();

  return `${basename}_${now.getFullYear()}${formatDigit(now.getUTCMonth() + 1)}${formatDigit(
    now.getDate()
  )}${formatDigit(now.getUTCHours())}${formatDigit(
    now.getUTCMinutes()
  )}${formatDigit(now.getUTCSeconds())}`;
};
