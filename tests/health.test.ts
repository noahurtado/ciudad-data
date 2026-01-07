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

describe('Health Service API', () => {
  
  test('GET /health/life-expectancy/:country returns data', async () => {
    const res = await request(app).get('/health/life-expectancy/USA');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('indicator');
    expect(res.body).toHaveProperty('value');
    expect(res.body.country).toBe('USA');
  });

  test('GET /health/infant-mortality/:country returns data', async () => {
    const res = await request(app).get('/health/infant-mortality/CHL');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('value');
    expect(res.body.country).toBe('CHL');
    expect(typeof res.body.value).toBe('string');
  });

  test('GET /health/infant-mortality/:country returns 404 for invalid country', async () => {
    const res = await request(app).get('/health/infant-mortality/XYZ');
    
    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('No infant mortality data found');
  });

  test('GET /health/life-expectancy/:country returns 404 for invalid country', async () => {
    const res = await request(app).get('/health/life-expectancy/INVALID');
    
    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('No life expectancy data found');
  });

  test('Health data contains a valid year', async () => {
    const res = await request(app).get('/health/life-expectancy/VEN');
    expect(res.status).toBe(200);
    expect(typeof res.body.year).toBe('number');
    expect(res.body.year).toBeGreaterThan(2010);
  });
});