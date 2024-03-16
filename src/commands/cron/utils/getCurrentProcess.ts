import * as pm2 from 'pm2';
import { Proc } from 'pm2';
import { buildCronProcessName } from './buildCronProcessName';

export const getCurrentProcess = async (
  id: string
): Promise<Proc | undefined> =>
  new Promise((resolve, reject) => {
    pm2.list((err, list) => {
      if (err) {
        reject(err);
      } else {
        resolve(list.find((p) => p.name === buildCronProcessName(id)));
      }
    });
  });
