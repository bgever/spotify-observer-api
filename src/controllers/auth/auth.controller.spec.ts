import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '../../core/jwt/jwt.service';
import { RedisService } from '../../core/redis/redis.service';
import { DataService } from '../../core/data/data.service';
import { OAuthService } from '../../core/oauth/oauth.service';
import { SpotifyService } from '../../core/spotify/spotify.service';

import { AuthController } from './auth.controller';
import { UserResponse } from 'src/core/spotify/user-response';

describe('Auth Controller', () => {

  const TOKENS = {
    accessToken: 'access_token',
    expiresIn: 30,
    expiresAt: new Date(Date.now() + 30000),
    scope: 'my_scope',
    refreshToken: 'refresh_token'
  };
  const USER: Partial<UserResponse> = { id: 'user_id' };

  const oauthSvcStub: Partial<OAuthService> = { getTokensWithCode: async () => TOKENS };
  const spotifySvcStub: Partial<SpotifyService> = { getUser: async () => USER as UserResponse };
  const dataSvcStub: Partial<DataService> = { storeAccess: async () => void 0 };
  const redisSvcStub: Partial<RedisService> = { setAccessToken: async () => null };

  let controller: AuthController;
  let oauthSvc: OAuthService;
  let spotifySvc: SpotifyService;
  let dataSvc: DataService;
  let redisSvc: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: JwtService, useValue: null },
        { provide: RedisService, useValue: redisSvcStub },
        { provide: DataService, useValue: dataSvcStub },
        { provide: OAuthService, useValue: oauthSvcStub },
        { provide: SpotifyService, useValue: spotifySvcStub }
      ]
    }).compile();

    controller = module.get(AuthController);
    oauthSvc = module.get(OAuthService);
    spotifySvc = module.get(SpotifyService);
    dataSvc = module.get(DataService);
    redisSvc = module.get(RedisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authorize', () => {

    it('responds', async () => {
      jest.spyOn(oauthSvc, 'getTokensWithCode');
      jest.spyOn(spotifySvc, 'getUser');
      jest.spyOn(dataSvc, 'storeAccess');
      jest.spyOn(redisSvc, 'setAccessToken');

      const CODE = 'auth_code';
      const result = await controller.authorize({ code: CODE });

      expect(oauthSvc.getTokensWithCode).toBeCalledWith(CODE);
      expect(spotifySvc.getUser).toBeCalledWith(TOKENS.accessToken);
      expect(dataSvc.storeAccess).toBeCalledWith(USER.id, TOKENS.refreshToken, USER);
      expect(redisSvc.setAccessToken).toBeCalledWith(USER.id, TOKENS.expiresIn, TOKENS.accessToken);
      expect(result).toBe('Hello World!');
    });

    // describe('with undefined access token', () => {

    //   it('errors', () => {
    //     expect(controller.authorize({ code: 'sad' })).toBe('Hello World!');
    //   });
    // });
  });
});
