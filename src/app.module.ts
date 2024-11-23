import { Module } from '@nestjs/common';
import { RouterModule } from './routers/router.module';
import { AppMiddlewareModule } from './core/app/app.middleware.module';
import { WorkerModule } from './workers/worker.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    //Middleware
    AppMiddlewareModule,
    // Common
    CommonModule,
    // Router
    RouterModule,
    // Workers
    WorkerModule,
    // Modules append...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
