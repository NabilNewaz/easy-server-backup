import * as chalk from 'chalk';

export const Colors = {
  bold: chalk.bold,
  greenBold: chalk.green.bold,
  green: chalk.green,
  yellowBold: chalk.yellow.bold,
  cyanBright: chalk.cyanBright
};

export const createLogger = (logger: string) => ({
  success(message: any): void {
    console.log(`${Colors.bold.green(`${logger}:`)} ${message}`);
  },
  successImportant(message: any): void {
    this.success(Colors.bold(`${message}\n`));
  },
  error(message: any): void {
    console.log(`${chalk.bold.red(`${logger}:`)} ${message}`);
  },
  warn(message: any): void {
    console.log(`${chalk.bold.yellow(`${logger}:`)} ${message}`);
  },
  errorImportant(message: any): void {
    this.error(Colors.bold(`${message}\n`));
  }
});
