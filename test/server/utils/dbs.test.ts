import { getDb, isDbInstanceAvailable, loadDbs } from '../../../src/server/utils/dbs'
import { DbDownloadingAllowanceType, SearchType, ServerConfig } from '../../../src/shared/interfaces'
import { getSampleDb, SampleDb } from '../../utils/sample'
import { fillConfig } from '../../../src/shared/utils/config'
import { checkConfig } from '../../../src/server/utils/config'

describe('function loadDbs', () => {
  it('should load dbs', async () => {
    process.env.SWARM_SEARCH_DOWNLOADER_SERVER_URL = 'dummyurl'
    process.env.SWARM_SEARCH_DOWNLOAD_ALLOWANCE_TYPE = DbDownloadingAllowanceType.ANY

    const db = await getSampleDb(SampleDb.suggest)
    const serverConfig = fillConfig()
    checkConfig(serverConfig)
    expect(isDbInstanceAvailable(db.id)).toEqual(false)
    expect(() => getDb(serverConfig, db.id)).toThrow(`Db "${db.id}" is not available`)

    const config: ServerConfig = {
      searchTypes: [SearchType.AUTOCOMPLETE],
      downloaderServerUrl: '',
      mainPort: 1,
      // define dbs path
      dbsPath: db.searchPath,
      dbAllowanceType: DbDownloadingAllowanceType.ALLOWED_LIST,
      // define allowed list of dbs
      allowedDbIds: [db.id],
    }

    loadDbs(config)
    expect(isDbInstanceAvailable(db.id)).toEqual(true)
    expect(getDb(serverConfig, db.id)).toBeDefined()
  })
})
