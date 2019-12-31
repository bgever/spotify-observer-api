import { Test, TestingModule } from '@nestjs/testing';

import { OAuthService } from './oauth.service';
import { OAuthConfig } from './oauth-config';

describe('OAuthService', () => {
  let service: OAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        { provide: OAuthConfig, useValue: new OAuthConfig('mock_redirect_uri', 'mock_id', 'mock_secret') }
      ],
    }).compile();
    service = module.get<OAuthService>(OAuthService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});
