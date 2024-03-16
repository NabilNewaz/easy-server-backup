import { ValidNotificatorConfig } from '../commands/validate-config/configs/notification/ValidNotificatorConfig';

export abstract class Notificator<
  T extends ValidNotificatorConfig = ValidNotificatorConfig
> {
  constructor(protected readonly config: T) {}

  abstract notify(message: string): Promise<void>;
}
