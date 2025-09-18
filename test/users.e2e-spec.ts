import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const basicAuthCredentials = 'admin:qwerty';
  const base64Credentials =
    Buffer.from(basicAuthCredentials).toString('base64');
  const users: [] = [];
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.getHttpAdapter().getInstance().set('trust proxy', true);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
    await request(app.getHttpServer()).delete('/testing/all-data');
  });

  it('/ (POST)', async () => {
    for (let i = 0; i < 3; i++) {
      const user = await request(app.getHttpServer())
        .post('/sa/users')
        .set('Authorization', `Basic ${base64Credentials}`)
        .send({
          login: `user${i}`,
          password: 'user12',
          email: `user${i}@example.com`,
        })
        .expect(201);
      // @ts-ignore
      users.push(user.body);
    }
  });

  it('should GET', async () => {
    const users = await request(app.getHttpServer())
      .get('/sa/users')
      .set('Authorization', `Basic ${base64Credentials}`)
      .query({
        pageSize: 15,
        pageNumber: 1,
        searchLoginTerm: 'eR',
        // searchEmailTerm: 'er1',
        sortBy: 'login',
        sortDirection: 'asc',
      })
      .expect(200);
    expect(users.body).toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining({ login: 'user2', email: 'user2@example.com' }),
        expect.objectContaining({ login: 'user1', email: 'user1@example.com' }),
        expect.objectContaining({ login: 'user0', email: 'user0@example.com' }),
      ]),
      page: 1,
      pageSize: 15,
      pagesCount: 1,
      totalCount: 3,
    });
    console.log(users.body);
  });
});
