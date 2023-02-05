import supertest from 'supertest'
import app from '../../src/server/app'
import { getSwarmHash } from '../utils/data'

function testOkFunction() {
  return jest.fn().mockImplementation((req, res) => {
    res.status(200).send({ response: 'test-ok' })
  })
}

jest.mock('../../src/server/routes/info', testOkFunction)
jest.mock('../../src/server/routes/index', testOkFunction)
jest.mock('../../src/server/routes/search', testOkFunction)
jest.mock('../../src/server/routes/suggest', testOkFunction)

describe('Middleware', () => {
  describe('/v1/info', () => {
    test('should call without id', async () => {
      const response = await supertest(app).get('/v1/info')

      expect(response.status).toBe(200)
      expect(response.body.response).toBe('test-ok')
    })
  })

  describe('/v1/index/*', () => {
    test('should fail without id', async () => {
      const response = await supertest(app).post('/v1/index/use')
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Missing "id" parameter' })

      const responseStatus = await supertest(app).post('/v1/index/status')
      expect(responseStatus.status).toBe(400)
      expect(responseStatus.body).toEqual({ error: 'Missing "id" parameter' })
    })

    test('should fail with invalid id', async () => {
      const response = await supertest(app).post('/v1/index/use').send({
        id: 'invalid',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid "id" format' })

      const responseStatus = await supertest(app).post('/v1/index/status').send({
        id: 'invalid',
      })

      expect(responseStatus.status).toBe(400)
      expect(responseStatus.body).toEqual({ error: 'Invalid "id" format' })
    })

    test('should call the route', async () => {
      // todo use swarm hash generator
      const response = await supertest(app).post('/v1/index/use').send({
        id: getSwarmHash(),
      })

      expect(response.status).toBe(200)
      expect(response.body.response).toBe('test-ok')

      // todo use swarm hash generator
      const response128 = await supertest(app)
        .post('/v1/index/use')
        .send({
          id: getSwarmHash(true),
        })

      expect(response128.status).toBe(200)
      expect(response128.body.response).toBe('test-ok')

      const responseStatus = await supertest(app).post('/v1/index/status').send({
        id: getSwarmHash(),
      })

      expect(responseStatus.status).toBe(200)
      expect(responseStatus.body.response).toBe('test-ok')

      const responseStatus128 = await supertest(app)
        .post('/v1/index/status')
        .send({
          id: getSwarmHash(true),
        })

      expect(responseStatus128.status).toBe(200)
      expect(responseStatus128.body.response).toBe('test-ok')
    })
  })

  describe('/v1/search', () => {
    test('should fail without id', async () => {
      const response = await supertest(app).get('/v1/search')
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Missing "id" parameter' })
    })

    test('should fail with invalid id', async () => {
      const response = await supertest(app).get('/v1/search').query({
        id: 'invalid',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid "id" format' })
    })

    test('should call the route', async () => {
      const response = await supertest(app).get('/v1/search').query({
        id: getSwarmHash(),
      })

      expect(response.status).toBe(200)
      expect(response.body.response).toBe('test-ok')

      const response128 = await supertest(app)
        .get('/v1/search')
        .query({
          id: getSwarmHash(true),
        })

      expect(response128.status).toBe(200)
      expect(response128.body.response).toBe('test-ok')
    })
  })

  describe('/v1/suggest', () => {
    test('should fail without id', async () => {
      const response = await supertest(app).get('/v1/suggest')
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Missing "id" parameter' })
    })

    test('should fail with invalid id', async () => {
      const response = await supertest(app).get('/v1/suggest').query({
        id: 'invalid',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid "id" format' })
    })

    test('should call the route', async () => {
      const response = await supertest(app).get('/v1/suggest').query({
        id: getSwarmHash(),
      })

      expect(response.status).toBe(200)
      expect(response.body.response).toBe('test-ok')

      const response128 = await supertest(app)
        .get('/v1/suggest')
        .query({
          id: getSwarmHash(true),
        })

      expect(response128.status).toBe(200)
      expect(response128.body.response).toBe('test-ok')
    })
  })
})
