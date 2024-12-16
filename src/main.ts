import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add all middlewares
  appCreate(app);

  // global interceptors
  // app.useGlobalInterceptors(new DataResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
