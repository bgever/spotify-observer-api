import { Injectable } from '@nestjs/common';
import { Tedis } from 'tedis';

/**
 * Handles interactions with Redis for temporary data.
 */
@Injectable()
export class RedisService {

  constructor(
    private readonly _redis: Tedis
  ) { }

  /**
   * Sets the access token.
   * @param userId For which user.
   * @param expiresIn Number of seconds after the token expires.
   * @param accessToken The access token.
   */
  setAccessToken(userId: string, expiresIn: number, accessToken: string): Promise<string> {
    return this._redis.setex(`AccessToken:${userId}`, expiresIn, accessToken);
  }

  async getAccessToken(userId: string) {
    const key = `AccessToken:${userId}`;
    return {
      accessToken: await this._redis.get(key) as string,
      expiresIn: await this._redis.ttl(key)
    };
  }
}
