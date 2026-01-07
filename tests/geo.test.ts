import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';

let app: any;

beforeAll(async () => {
  await mongoose.connect(env.MONGO_URI);
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Geo Service API', () => {
  test('GET /geo/city/:city returns coordinates', async () => {
    const res = await request(app).get('/geo/city/Caracas');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('lat');
    expect(res.body).toHaveProperty('lon');
  });

  test('GET /geo/city/:city returns 404 for non-existent city', async () => {
    const res = await request(app).get('/geo/city/ThisCityDoesNotExist123');
    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('City not found');
  });

  test('GET /geo/population/:country returns population', async () => {
    const res = await request(app).get('/geo/population/CL');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('value');
  });

  test('GET /geo/population/:country returns 404 for invalid country code', async () => {
    const res = await request(app).get('/geo/population/ZZ');
    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Population data not found');
  });

  test('POST /geo/report validates body', async () => {
    const res = await request(app).post('/geo/report').send({ type: 'bache' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});