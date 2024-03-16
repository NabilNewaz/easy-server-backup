import { Notificator } from './Notificator';
import { TelegramNotificatorConfig } from '../commands/validate-config/configs/notification/TelegramNotificatorConfig';
import { Container } from 'typedi';
import axios from 'axios';
import { createLogger } from '../util/CreateLogger';
import { CliParams } from '../commands/CliParams';

const logger = createLogger('TelegramNotificator');

export class TelegramNotificator extends Notificator<TelegramNotificatorConfig> {
  async notify(message: string): Promise<void> {
    const params = Container.get<CliParams>('params');

    if (!params.dry) {
      try {
        await this.sendNotification(message);
      } catch (e) {
        logger.errorImportant('Notification send error');
        logger.errorImportant(e);
      }
    } else {
      logger.warn(`Dry execution: skipping send notification (${message})`);
    }
  }

  sendNotification = async (message: string): Promise<void> => {
    const body = {
      chat_id: this.config.chatId,
      text: message,
      disable_notification: true
    };

    await axios.post(
      `https://api.telegram.org/bot${this.config.botToken}/sendMessage`,
      body
    );
  };
}
