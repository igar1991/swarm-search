import { SearchClient } from '../../src/client'
import serverApp, { reloadConfig } from '../../src/server/app'
import allDownloaderApps from '../../src/downloader/all-downloader-apps'
import { getSwarmHash } from '../utils/data'
import http from 'http'
import { cleanupDb, DbStatus } from '../../src/downloader/downloader'
import { getSampleDb, getSampleDbInfo, SampleDb } from '../utils/sample'

jest.setTimeout(500000)
let downloaderApps: {
  appInstance: http.Server
  stopManager: () => void
}
let serverAppInstance: http.Server
describe('Client', () => {
  it('client api test', async () => {
    const dbId = getSwarmHash()
    const maxSizeDbBytes = 10
    const maxSizeTotalBytes = 10
    const downloaderServerPort = 2222
    const serverPort = 3333
    const serverUrl = `http://localhost:${serverPort}/v1`
    const downloaderUrl = `http://localhost:${downloaderServerPort}/v1`
    const beeUrl = 'http://localhost:1633'
    const sleepTime = 1000

    const dbInfoOnly = getSampleDbInfo(SampleDb.suggest)
    cleanupDb(dbInfoOnly.searchPath, dbInfoOnly.id)
    process.env.SWARM_DOWNLOADER_BEE_URL = beeUrl
    process.env.SWARM_DOWNLOADER_OUTPUT_PATH = dbInfoOnly.searchPath
    process.env.SWARM_DOWNLOADER_SLEEP_TIME = sleepTime.toString()
    process.env.SWARM_DOWNLOADER_PORT = downloaderServerPort.toString()
    downloaderApps = allDownloaderApps()

    process.env.SWARM_SEARCH_TYPES = 'a'
    process.env.SWARM_SEARCH_DBS_PATH = dbInfoOnly.searchPath
    process.env.SWARM_SEARCH_MAIN_PORT = serverPort.toString()
    process.env.SWARM_SEARCH_DOWNLOADER_SERVER_URL = downloaderUrl
    process.env.SWARM_SEARCH_DOWNLOAD_ALLOWANCE_TYPE = 'allowed_list'
    process.env.SWARM_SEARCH_ALLOWED_DBS = `${dbId},${dbInfoOnly.id}`
    process.env.SWARM_SEARCH_MAX_SIZE_DB_BYTES = maxSizeDbBytes.toString()
    process.env.SWARM_SEARCH_TOTAL_BYTES_ALLOWED = maxSizeTotalBytes.toString()
    reloadConfig()
    serverAppInstance = await new Promise<http.Server>(resolve => {
      const serverAppInstance = serverApp.listen(serverPort, () => {
        // eslint-disable-next-line no-console
        console.log(`Main server running on port ${serverPort}`)
        resolve(serverAppInstance)
      })
    })

    // call getSampleDb db after servers init to check ability to load new dbs
    const db = await getSampleDb(SampleDb.suggest)
    const client = new SearchClient(serverUrl)
    const serverInfo = await client.getServerInfo()
    expect(serverInfo).toEqual({
      v: '1',
      dbAllowanceType: 'allowed_list',
      maxSizeDbBytes: 0,
      bytesAvailable: 0,
      allowedSearchTypes: [{ type: 'a', title: 'Autocomplete' }],
    })

    const indexStatusBeforeAdd = await client.getIndexStatus(dbId)
    expect(indexStatusBeforeAdd.id).toEqual(dbId)
    expect(indexStatusBeforeAdd.status).toEqual(DbStatus[DbStatus.NO_INFORMATION])

    const useIndexResponse = await client.useIndex(dbId)
    expect(useIndexResponse.id).toEqual(dbId)
    expect(useIndexResponse.status).toEqual(DbStatus[DbStatus.WAIT])

    // get status of the available db
    const indexStatusExists = await client.getIndexStatus(db.id)
    expect(indexStatusExists.id).toEqual(db.id)
    expect(indexStatusExists.status).toEqual(DbStatus[DbStatus.DONE])

    const query = 'h'
    const suggestResponse = await client.suggest(db.id, query)
    expect(suggestResponse.id).toEqual(db.id)
    expect(suggestResponse.query).toEqual(query)
    expect(suggestResponse.result).toHaveLength(10)
  })

  afterAll(() => {
    if (downloaderApps) {
      downloaderApps.appInstance.close()
      downloaderApps.stopManager()
    }

    if (serverAppInstance) {
      serverAppInstance.close()
    }
  })
})
