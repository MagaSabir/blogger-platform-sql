import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import process from 'node:process';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const basicAuthCredentials = 'admin:qwerty';
  const base64Credentials =
    Buffer.from(basicAuthCredentials).toString('base64');
  const users: [] = [];
  beforeAll(async () => {
    process.env.NODE_ENV = 'testing.local';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.getHttpAdapter().getInstance().set('trust proxy', true);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
    // await request(app.getHttpServer()).delete('/testing/all-data');
  });

  afterAll(async () => {
    await app.close();
  });

  // it('/ (POST)', async () => {
  //   for (let i = 0; i < 3; i++) {
  //     const user = await request(app.getHttpServer())
  //       .post('/sa/users')
  //       .set('Authorization', `Basic ${base64Credentials}`)
  //       .send({
  //         login: `user${i}`,
  //         password: 'user12',
  //         email: `user${i}@example.com`,
  //       })
  //       .expect(201);
  //     // @ts-ignore
  //     users.push(user.body);
  //   }
  // });

  it('should GET', async () => {
    const users = await request(app.getHttpServer())
      .get('/sa/users')
      .set('Authorization', `Basic ${base64Credentials}`)
      .query({
        pageSize: 15,
        pageNumber: 1,
        searchLoginTerm: 'seR',
        searchEmailTerm: '.com',
        sortBy: 'login',
        sortDirection: 'asc',
      })
      .expect(200);
    expect(users.body.items).toEqual([
      {
        id: '156',
        login: 'loSer',
        email: 'email2p@gg.om',
        createdAt: '2025-09-23T05:22:03.404Z',
      },
      {
        id: '154',
        login: 'log01',
        email: 'emai@gg.com',
        createdAt: '2025-09-23T05:22:02.464Z',
      },
      {
        id: '155',
        login: 'log02',
        email: 'email2p@g.com',
        createdAt: '2025-09-23T05:22:02.926Z',
      },

      {
        id: '157',
        login: 'uer15',
        email: 'emarrr1@gg.com',
        createdAt: '2025-09-23T05:22:03.904Z',
      },
    ]);

    expect(users.body).toMatchObject({
      page: 1,
      pageSize: 15,
      pagesCount: 1,
      totalCount: 4,
    });
  });
});
