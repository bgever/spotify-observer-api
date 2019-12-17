import { Controller, Post, Body } from '@nestjs/common';

import { AuthorizeDto } from './dtos/authorize-dto';
import { JwtService } from 'src/core/jwt/jwt.service';

@Controller('auth')
export class AuthController {

  constructor(
    private _jwtSvc: JwtService
  ) { }

  /**
   * Authorize a new or existing session for the API.
   * @param dto Arguments to determine whether to start a new or renew an existing session.
   */
  @Post('authorize')
  authorize(@Body() dto: AuthorizeDto) {

    console.log('DTO:', dto);

    let accessToken: string;
    let expiresAt: Date;
    let jwt: string;

    if (dto.code) {
      // Expect authorization code
      // Exchange the authorization code for access and refresh tokens
      // Call user info API to determine user ID.
      const userId = 'abc';
      // Store user ID + profile + refresh token + access log in MongoDB.
      // Only return the bearer token JWT for server-side API access if a code was used.
      jwt = this._jwtSvc.create(userId);
    } else if (dto.jwt) {
      // First ensure JWT is validated.
      // Check if there is still a reusable access token in the Redis cache, if so reuse it.
      // Otherwise fetch refresh token for user ID, and attempt to renew the access token.
    } else {
      throw new Error('Hmm');
    }
    // Store latest access token for user ID in the sessions Redis cache.
    // Return access token (for in-browser API access).

    return { jwt, accessToken, expiresAt };
  }
}
