import * as pm2 from 'pm2';
import { Proc } from 'pm2';
import { PROCESS_CRON_NAME_PREFIX } from './buildCronProcessName';

export const getCurrentProcesses = async (): Promise<Proc[] | undefined> =>
  new Promise((resolve, reject) => {
    pm2.list((err, list) => {
      if (err) {
        reject(err);
      } else {
        resolve(list.filter((p) => p.name.includes(PROCESS_CRON_NAME_PREFIX)));
      }
    });
  });
