import * as pm2 from 'pm2';
import { Proc } from 'pm2';
import { buildCronProcessName } from './buildCronProcessName';

export const Pm2Promisified = () => ({
  connect: () =>
    new Promise<void>((resolve, reject) =>
      pm2.connect((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    ),
  start: (options: pm2.StartOptions) =>
    new Promise<Proc>((resolve, reject) =>
      pm2.start(options, (err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      })
    ),
  delete: (identifier: string) =>
    new Promise<Proc>((resolve, reject) =>
      pm2.delete(buildCronProcessName(identifier), (err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      })
    )
});
