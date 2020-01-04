import { Controller, Post, Body, UnauthorizedException, Logger } from '@nestjs/common';

import { JwtService } from '../../core/jwt/jwt.service';
import { RedisService } from '../../core/redis/redis.service';
import { OAuthService } from '../../core/oauth/oauth.service';
import { DataService } from '../../core/data/data.service';
import { SpotifyService } from '../../core/spotify/spotify.service';

import { AuthorizeDto } from './dtos/authorize-dto';

@Controller('auth')
export class AuthController {

  private readonly _logger = new Logger(AuthController.name);

  constructor(
    private _jwtSvc: JwtService,
    private _redisSvc: RedisService,
    private _dataSvc: DataService,
    private _oauthSvc: OAuthService,
    private _spotifySvc: SpotifyService
  ) { }

  /**
   * Authorize a new or existing session for the API.
   * @param dto Arguments to determine whether to start a new or renew an existing session.
   */
  @Post('authorize')
  async authorize(@Body() dto: AuthorizeDto) {

    let accessToken: string;
    let expiresAt: Date;
    let jwt: string;

    // Expect authorization code.
    if (dto.code) {
      this._logger.verbose('Authorize by authorization code');

      // Exchange the authorization code for access and refresh tokens.
      const tokens = await this._oauthSvc.getTokensWithCode(dto.code);
      accessToken = tokens.accessToken;
      expiresAt = tokens.expiresAt;

      // Call user info API to determine user ID.
      const user = await this._spotifySvc.getUser(accessToken);
      const userId = user.id;

      // Store user ID + profile + refresh token + access log in MongoDB.
      await this._dataSvc.storeAccess(userId, tokens.refreshToken, tokens.scope, user);

      // Store the access token for future use based on the JWT.
      await this._redisSvc.setAccessToken(userId, tokens.expiresIn, accessToken);

      // Only return the bearer token JWT for server-side API access if a code was used.
      jwt = this._jwtSvc.create(userId);

    } else if (dto.jwt) {
      this._logger.verbose('Authorize by JWT');

      // First ensure JWT is validated.
      let decodedJwt;
      try {
        decodedJwt = this._jwtSvc.verify(dto.jwt);
      } catch (e) {
        console.error('Invalid JWT: ', e);
        throw new Error('Invalid JWT');
      }

      // Check if there is still a reusable access token in the Redis cache, if so reuse it.
      let cachedAccessToken = await this._redisSvc.getAccessToken(decodedJwt.sub);
      // Ensure there is an access token and it hasn't expired.
      if (cachedAccessToken.accessToken === null || cachedAccessToken.expiresIn < 10) {
        // Otherwise fetch refresh token for user ID, and attempt to renew the access token.
        const userId = decodedJwt.sub;
        const refreshToken = await this._dataSvc.findRefreshToken(userId);
        if (refreshToken === null) {
          throw new UnauthorizedException(`No refresh token for user with ID '${userId}'.`);
        }
        const tokens = await this._oauthSvc.refreshAccessToken(refreshToken);
        // Store the latest access token for future use.
        await this._redisSvc.setAccessToken(userId, tokens.expiresIn, tokens.accessToken);
        cachedAccessToken = { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn };
      }

      accessToken = cachedAccessToken.accessToken;
      expiresAt = new Date(Date.now() + (cachedAccessToken.expiresIn * 1000));
    } else {
      throw new Error('Invalid input.');
    }

    // Return access token (for in-browser API access).
    return { jwt, accessToken, expiresAt };
  }
}
