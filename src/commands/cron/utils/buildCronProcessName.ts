export const PROCESS_CRON_NAME_PREFIX = `easy-backup-cron-`;

export const buildCronProcessName = (id: string): string => {
  return `${PROCESS_CRON_NAME_PREFIX}${id}`;
};
