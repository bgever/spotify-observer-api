import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { OAuthConfig } from './oauth-config';
import { OAuthTokenResponse } from './oauth-code-response';
import { stringify } from 'querystring';

/**
 * Handles interactions with the Spotify OAuth API.
 */
@Injectable()
export class OAuthService {

  constructor(
    private readonly _config: OAuthConfig
  ) { }

  /**
   * Gets access and refresh tokens by exchanging an authorization code.
   * @param code Authorization code.
   */
  async getTokensWithCode(code: string) {
    // Exchange the authorization code for access and refresh tokens
    const tokenResponse = await axios.post<OAuthTokenResponse>('https://accounts.spotify.com/api/token',
      stringify({ // Use `stringify` for `application/x-www-form-urlencoded` format.
        grant_type: 'authorization_code',
        code,
        redirect_uri: this._config.redirectUri, // Used for verification, not for actual redirect.
        client_id: this._config.clientId,
        client_secret: this._config.clientSecret
      }));
    return {
      accessToken: tokenResponse.data.access_token,
      expiresIn: tokenResponse.data.expires_in,
      expiresAt: new Date(Date.now() + (tokenResponse.data.expires_in * 1000)),
      scope: tokenResponse.data.scope,
      refreshToken: tokenResponse.data.refresh_token
    };
  }

  async refreshAccessToken(refreshToken: string) {
    // Exchange the authorization code for access and refresh tokens
    const tokenResponse = await axios.post<OAuthTokenResponse>('https://accounts.spotify.com/api/token',
      stringify({ // Use `stringify` for `application/x-www-form-urlencoded` format.
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this._config.clientId,
        client_secret: this._config.clientSecret
      }));
    return {
      accessToken: tokenResponse.data.access_token,
      expiresIn: tokenResponse.data.expires_in,
      expiresAt: new Date(Date.now() + (tokenResponse.data.expires_in * 1000))
    };
  }
}
