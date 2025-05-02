import supertest from 'supertest';
import app from '../src/server';

const request = supertest(app);

describe('Auth Routes - Endpoint Availability', () => {
  it('POST /api/v1/auth/signup should respond with a status code', async () => {
    const res = await request.post('/api/v1/auth/signup').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect([201, 400, 500]).toContain(res.statusCode);
  });

  it('POST /api/v1/auth/login should respond with a status code', async () => {
    const res = await request.post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect([200, 400, 500]).toContain(res.statusCode);
  });
});
