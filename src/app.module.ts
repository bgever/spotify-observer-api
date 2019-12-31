import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { Tedis } from 'tedis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtService } from './core/jwt/jwt.service';
import { RedisService } from './core/redis/redis.service';
import { OAuthService } from './core/oauth/oauth.service';
import { SpotifyService } from './core/spotify/spotify.service';
import { DataService } from './core/data/data.service';
import { OAuthConfig } from './core/oauth/oauth-config';
import { JwtConfig } from './core/jwt/jwt-config';

const REDIS_HOST = process.env.REDIS_HOST;

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: Tedis,
      useValue: new Tedis({ host: REDIS_HOST })
    },
    {
      provide: OAuthConfig,
      useValue: new OAuthConfig(
        process.env.AUTH_REDIRECT_URI,
        process.env.AUTH_CLIENT_ID,
        process.env.AUTH_CLIENT_SECRET
      )
    },
    {
      provide: JwtConfig,
      useValue: new JwtConfig(
        process.env.JWT_PRIVATE_KEY_PEM,
        process.env.JWT_PUBLIC_KEY_PEM,
        process.env.JWT_AUDIENCE,
        process.env.JWT_ISSUER,
        process.env.JWT_ALGORITHM
      )
    },
    JwtService,
    RedisService,
    OAuthService,
    SpotifyService,
    DataService,
  ],
})
export class AppModule { }
