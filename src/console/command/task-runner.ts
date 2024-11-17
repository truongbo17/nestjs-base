import { Command, CommandRunner } from 'nest-commander';
import tran from '../../utils/language';

@Command({
  name: 'hello',
  options: { isDefault: true },
})
export class TaskRunner extends CommandRunner {
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const name = await tran(['user.name']);
    console.log(123, name);
    console.log(inputs, options);
  }
}
