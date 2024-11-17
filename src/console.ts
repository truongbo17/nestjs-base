import { BootstrapConsole } from 'nestjs-console';
import { AppCommandModule } from './console/command/app.command.module';

const bootstrap = new BootstrapConsole({
  module: AppCommandModule,
  useDecorators: true,
});
bootstrap.init().then(async (app) => {
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
