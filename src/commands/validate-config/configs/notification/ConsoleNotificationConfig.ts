import * as yup from 'yup';

export type ConsoleNotificatorConfig = {
  type: 'console';
  successMessage: string;
  errorMessage: string;
};

export const ConsoleNotificatorConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('console')),
  successMessage: yup.string().default('Backup upload successfully 🚀'),
  errorMessage: yup.string().default('An exception occurred while making backup')
});
