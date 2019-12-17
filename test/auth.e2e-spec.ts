import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/authorize (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/authorize')
      .expect(400)
      .expect(JSON.stringify({
        statusCode: 400,
        error: 'Bad Request',
        message: [{
          target: {},
          property: 'code',
          children: [],
          constraints: { isNotEmpty: 'code should not be empty' },
        }],
      }));
  });
});
