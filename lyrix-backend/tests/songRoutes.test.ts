import supertest from 'supertest';
import app from '../src/server';

test('GET test list of songs', async () => {
  await supertest(app)
    .get('/api/v1/songs/lyrics')
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(7);
    });
});

test('GET test song detail', async () => {
  await supertest(app)
    .get('/api/v1/songs/lyrics')
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      // Check the response data
      expect(response.body[0]._id).toBe('6810782103d3465236f209cd');
      expect(response.body[0].title).toBe('Paparazzi');
      expect(response.body[0].artist).toBe('Lady Gaga');
    });
});
