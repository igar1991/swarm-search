import supertest from 'supertest'
import app, { reloadConfig } from '../../../src/server/app'
import { SuggestResponse } from '../../../src/server/interfaces'
import { getSampleDb, SampleDb } from '../../utils/sample'

jest.setTimeout(500000)
describe('/suggest', () => {
  it('/suggest should return data', async () => {
    const db = await getSampleDb(SampleDb.suggest)
    process.env.SWARM_SEARCH_DBS_PATH = db.searchPath
    process.env.SWARM_SEARCH_ALLOWED_DBS = db.id
    process.env.SWARM_SEARCH_DOWNLOADER_SERVER_URL = 'http://dummyhost'
    reloadConfig()
    const correctQuery = 'h'
    const incorrectQuery = 'h'.repeat(100)
    const responseIncorrect = await supertest(app).get('/v1/suggest').query({
      id: db.id,
      q: incorrectQuery,
    })

    expect(responseIncorrect.status).toBe(500)
    expect(responseIncorrect.body.message).toBe('Incorrect length of suggest query. Min length is 1, max length is 20')

    const responseCorrect = await supertest(app).get('/v1/suggest').query({
      id: db.id,
      q: correctQuery,
    })
    const data = responseCorrect.body as SuggestResponse
    expect(responseCorrect.status).toBe(200)
    expect(data.id).toEqual(db.id)
    expect(data.query).toEqual(correctQuery)
    expect(data.result).toHaveLength(10)
    expect(data.result).toEqual([
      { page: { relativeUrl: 'H.D.Kote', preview: '' } },
      { page: { relativeUrl: 'HAH', preview: '' } },
      { page: { relativeUrl: 'HAJ', preview: '' } },
      { page: { relativeUrl: 'HAK', preview: '' } },
      { page: { relativeUrl: 'HAM', preview: '' } },
      { page: { relativeUrl: 'HAN', preview: '' } },
      { page: { relativeUrl: 'HAO', preview: '' } },
      { page: { relativeUrl: 'HAR', preview: '' } },
      { page: { relativeUrl: 'HAU', preview: '' } },
      { page: { relativeUrl: 'HAV', preview: '' } },
    ])
  })
})
