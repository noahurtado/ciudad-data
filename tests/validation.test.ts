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

describe('Security & Validation Tests', () => {

  test('GET /geo/city/:city handles special characters safely', async () => {
    const res = await request(app).get('/geo/city/$where: "1==1"');
    expect(res.status).not.toBe(500);
  });

  test('POST /transit/incident fails with empty body', async () => {
    const res = await request(app).post('/transit/incident').send({});
    expect(res.status).toBe(400); 
    expect(res.body.error.message).toBeDefined();
  });

  test('GET /transit/eta fails without stopId query param', async () => {
    const res = await request(app).get('/transit/eta'); 
    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/required|missing|stop_id/i);
  });

  test('GET /geo/city/:city handles extremely long strings', async () => {
    const longString = 'a'.repeat(500);
    const res = await request(app).get(`/geo/city/${longString}`);
    expect(res.status).toBe(404); 
  });

  test('GET /health/life-expectancy/:country handles numeric/invalid codes', async () => {
    const res = await request(app).get('/health/life-expectancy/123');
    
    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('No life expectancy data found');
  });

  test('GET /health/life-expectancy/:country prevents filter injection', async () => {
    const injection = "VEN' or '1'='1";
    const res = await request(app).get(`/health/life-expectancy/${encodeURIComponent(injection)}`);
    
    expect(res.status).toBe(400);
  });

});