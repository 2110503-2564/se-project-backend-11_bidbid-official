const app = require('../server');
const request = require('supertest');
const mongoose = require('mongoose');

describe('GET /api/v1/therapists/verified', () => {
    it('should return a list of verified therapists', async () => {
        const res = await request(app)
        .get('/api/v1/therapists/verified');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('therapists');
        expect(res.body.therapists).toBeInstanceOf(Array);
        expect(res.body.therapists.length).toEqual(6);
    });
});

afterAll(async () => {
  await mongoose.connection.close();
  // server.close();
});
