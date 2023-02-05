import supertest from 'supertest'
import app from '../../../src/server/app'

describe('/info', () => {
  it('/info should return data', async () => {
    const response = await supertest(app).get('/v1/info')

    expect(response.status).toBe(200)
    const data = response.body
    expect(Object.keys(data)).toHaveLength(5)
    expect(data.v).toEqual('1')
    expect(data.dbAllowanceType).toEqual('allowed_list')
    // todo pass params via env and check
    // expect(data.maxSizeDbBytes).toEqual(10)
    // expect(data.bytesAvailable).toEqual(10)
    expect(data.allowedSearchTypes).toEqual([{ type: 'a', title: 'Autocomplete' }])
  })
})
