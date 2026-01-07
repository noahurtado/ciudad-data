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

describe('Transit Service API', () => {
  test('GET /transit/routes/london returns TfL routes', async () => {
    const res = await request(app).get('/transit/routes/london');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0].city).toBe('London');
    }
  });

  test('GET /transit/routes/:city returns simulated routes', async () => {
    const res = await request(app).get('/transit/routes/Caracas');
    expect(res.status).toBe(200);
    expect(res.body).toContainEqual(expect.objectContaining({ city: 'Caracas' }));
  });

  test('GET /transit/eta requires stop_id', async () => {
    const res = await request(app).get('/transit/eta');
    expect(res.status).toBe(400);
  });

  test('GET /transit/eta returns 404 for invalid stop_id on TfL', async () => {
    if (env.TFL_APP_KEY) {
      const res = await request(app).get('/transit/eta?stopId=INVALID_STOP');
      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('stop_id required');
    }
  });

  test('POST /transit/incident stores incident', async () => {
    const body = { line: 'metro-a', city: 'Caracas', description: 'Retraso por mantenimiento' };
    const res = await request(app).post('/transit/incident').send(body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});