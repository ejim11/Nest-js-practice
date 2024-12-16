// import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
// import { AppModule } from '../src/app.module';
import { boostrapNestApplication } from './helpers/boostrap-nest-application.helper';
import { ConfigService } from '@nestjs/config';
import { dropDatabase } from './helpers/drop-database.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let config: ConfigService;
  let httpServer;

  beforeEach(async () => {
    app = await boostrapNestApplication();
    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });

  it('/ (GET)', () => {
    return request(httpServer).get('/').expect(200);
  });
});
