export class OAuthConfig {
  constructor(
    public redirectUri: string,
    public clientId: string,
    public clientSecret: string
  ) {
    if (!this.redirectUri) {
      throw new Error('Undefined Redirect URI.');
    }
    if (!this.clientId) {
      throw new Error('Undefined Client ID.');
    }
    if (!this.clientSecret) {
      throw new Error('Undefined Client Secret.');
    }
  }
}
