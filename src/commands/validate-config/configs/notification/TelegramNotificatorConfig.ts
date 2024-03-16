import * as yup from 'yup';

export type TelegramNotificatorConfig = {
  type: 'telegram';
  chatId: string;
  botToken: string;
  successMessage: string;
  errorMessage: string;
};

export const TelegramNotificatorConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('telegram')),
  chatId: yup.string().required(),
  botToken: yup.string().required(),
  successMessage: yup.string().default('Backup upload successfully 🚀'),
  errorMessage: yup.string().default('An exception occurred while making backup')
});
