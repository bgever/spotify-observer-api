/**
 * Successful OAuth response to a token grant.
 */
export interface OAuthTokenResponse {
  access_token: string;
  /** `"Bearer"` */
  token_type: string;
  /** E.g. `"user-read-private user-read-email"` */
  scope: string;
  /** E.g. `3600` */
  expires_in: number;
  /** Optional, may not be set when a refresh token is used to request a new access token. */
  refresh_token?: string;
}
