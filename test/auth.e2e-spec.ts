import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import * as process from 'node:process';
import { DataSource } from 'typeorm';

describe('AUTH', () => {
  let app: INestApplication<App>;
  beforeAll(async () => {
    process.env.NODE_ENV = 'testing';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const dataSource = moduleFixture.get<DataSource>(DataSource);

    dataSource.query(`TRUNCATE TABLE "Sessions"`);
    app = moduleFixture.createNestApplication();
    app.getHttpAdapter().getInstance().set('trust proxy', true);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  describe('SESSIONS', () => {
    let token: string;
    it('should get token after login', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: 'test1', password: 'string' })
        .expect(200);
      token = result.body.accessToken;
    });

    it('should add session', async () => {
      const result = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(result.body).toEqual(expect.objectContaining({ userId: '6' }));
    });
  });

  describe('Registration and confirmation', () => {
    it('should register user and send email', async () => {});
  });
});
