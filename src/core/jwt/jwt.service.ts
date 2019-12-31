import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

import { JwtConfig } from './jwt-config';

/**
 * Handles the creation and validation of JWTs (JSON Web Tokens).
 */
@Injectable()
export class JwtService {

  constructor(
    private readonly _config: JwtConfig
  ) { }

  create(userId: string) {
    const config = this._config;
    return sign({}, config.privateKey, {
      algorithm: config.algorithm,
      subject: userId,
      expiresIn: '1 year',
      audience: config.audience,
      issuer: config.issuer
    });
  }

  verify(jwt: string, ignoreExpiration = false) {
    const config = this._config;
    return verify(jwt, config.publicKey, {
      algorithms: [config.algorithm],
      audience: config.audience,
      issuer: config.issuer,
      ignoreExpiration
    }) as object;
  }
}
