import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import * as AxiosError from 'axios-error';

import { AppModule } from './app.module';
import { AxiosErrorFilter } from './system/axios-error.filter';

// Wrap axios errors so they can be caught by the error handler.
axios.interceptors.response.use(response => response, error => Promise.reject(new AxiosError(error)));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://app.localhost']
    }
  });
  app.useGlobalFilters(new AxiosErrorFilter());
  await app.listen(3000);
}
bootstrap();
