/**
 * Document here:
 *
 * https://nest-commander.jaymcdoniel.dev
 * https://github.com/Pop-Code/nestjs-console/wiki
 * */
import { BootstrapConsole } from 'nestjs-console';
import { AppCommandModule } from './console/command/app.command.module';
import { INestApplicationContext } from '@nestjs/common';

const bootstrap = new BootstrapConsole({
  module: AppCommandModule,
  useDecorators: true,
});
bootstrap.init().then(async (app: INestApplicationContext) => {
  try {
    await app.init();
    await bootstrap.boot();
    await app.close();
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
