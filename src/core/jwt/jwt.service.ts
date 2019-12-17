import { Injectable } from '@nestjs/common';

import { sign, verify } from 'jsonwebtoken';

const ALGORITHM = process.env.JWT_ALGORITHM || 'RS256';
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY_PEM;
const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY_PEM;
const AUDIENCE = (process.env.JWT_AUDIENCE || 'https://spotify.observer/app/').split('|');
const ISSUER = process.env.JWT_ISSUER || 'https://spotify.observer/api/v1/';

@Injectable()
export class JwtService {

  create(userId: string) {
    return sign({}, PRIVATE_KEY, {
      algorithm: ALGORITHM,
      subject: userId,
      expiresIn: '1 year',
      audience: AUDIENCE,
      issuer: ISSUER
    });
  }

  verify(jwt: string, ignoreExpiration = false) {
    return verify(jwt, PUBLIC_KEY, {
      algorithms: [ALGORITHM],
      audience: AUDIENCE,
      issuer: ISSUER,
      ignoreExpiration
    }) as string;
  }
}
