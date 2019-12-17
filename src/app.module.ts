import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtService } from './core/jwt/jwt.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    JwtService,
  ],
})
export class AppModule {}
