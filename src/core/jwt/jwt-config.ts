import { Secret } from 'jsonwebtoken';

export class JwtConfig {

  audience: string[];

  constructor(
    /** Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA. */
    public privateKey: Secret,
    /** Either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA. */
    public publicKey: Secret,
    /** Audience URL(s). Separate multiple URLs with the `|` character. */
    audiences?: string,
    public issuer?: string,
    public algorithm?: string
  ) {
    const newlineRegex = /\\n/g;
    if (typeof privateKey === 'string') {
      this.privateKey = privateKey.replace(newlineRegex, '\n');
    }
    if (typeof publicKey === 'string') {
      this.publicKey = publicKey.replace(newlineRegex, '\n');
    }
    this.audience = (audiences || 'https://spotify.observer/app/').split('|');
    this.issuer = issuer || 'https://spotify.observer/api/v1/';
    this.algorithm = algorithm || 'RS256';
  }
}
