import { Notificator } from './Notificator';
import { createLogger } from '../util/CreateLogger';
import { ConsoleNotificatorConfig } from '../commands/validate-config/configs/notification/ConsoleNotificationConfig';

const logger = createLogger('ConsoleNotificator');

export class ConsoleNotificator extends Notificator<ConsoleNotificatorConfig> {
  async notify(message: string): Promise<void> {
    logger.success(message);
  }
}
