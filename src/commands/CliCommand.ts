import { Command, Option } from 'commander';

const dryOption = new Option('--dry', 'Only creates backup file');
const configFileOption = new Option('-f, --file <config>', 'Config file path');

export abstract class CliCommand<T = Record<string, unknown>> {
  protected command: Command;

  constructor(protected readonly program: Command) {
    // ignore

    this.command = this.createCommand();

    this.addOptions();
  }

  abstract execute(cliParams: T): Promise<void>;

  abstract createCommand(): Command;

  protected addOptions(): void {
    this.command.addOption(dryOption);
    this.command.addOption(configFileOption);
  }
}
