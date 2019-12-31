import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { JwtConfig } from './jwt-config';
import { MOCK_JWT_CONFIG } from './jwt-config.mock';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        { provide: JwtConfig, useValue: MOCK_JWT_CONFIG }
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {

    it('can generate a JWT', () => {
      const jwt = service.create('my_id');
      expect(jwt).toEqual('JWT'); // TODO: Mock iat/exp claims for consistent output.
    });

  });
});
