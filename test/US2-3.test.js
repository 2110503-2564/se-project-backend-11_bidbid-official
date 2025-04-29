const app = require('../server'); // <<== แก้ import ไม่มี {} แล้ว
const request = require('supertest');
const mongoose = require('mongoose');

describe('Therapist Reservation', () => {
  let token;

  it('should log in and get token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'therapistverified99@gmail.com',
        password: '123456'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true); 
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it('should fetch reservations', async () => {
    const res = await request(app)
      .get('/api/v1/therapists/me/reservations') 
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true); 
    expect(res.body.count).toBe(0);
    expect(res.body.data).toHaveLength(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
