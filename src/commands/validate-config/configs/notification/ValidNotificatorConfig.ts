import { TelegramNotificatorConfig } from './TelegramNotificatorConfig';
import { ConsoleNotificatorConfig } from './ConsoleNotificationConfig';

export type ValidNotificatorConfig = TelegramNotificatorConfig | ConsoleNotificatorConfig;
