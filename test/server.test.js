const { app, server } = require('../server');
const request = require('supertest');
const mongoose = require('mongoose');

describe('GET /api/v1/hello', () => {
  it('should return Hello from the API', async () => {
    const res = await request(app).get('/api/v1/hello');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Hello from the API!');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
