import {
  addQueue,
  cleanupDb,
  DbStatus,
  getDbPaths,
  getDbStatus,
  startDownloaderManager,
  stopManager,
} from '../../src/downloader/downloader'
import { join } from 'path'
import { getSwarmHash, makeData } from '../utils/data'
import { DBInformation } from '../../src/shared/db/interfaces'
import { Bee, Data, ReferenceOrEns, RequestOptions } from '@ethersphere/bee-js'
import { sleep } from '../../src/shared/utils'
import fs from 'fs'

jest.setTimeout(100000)
const outDirectoryPath = join(__dirname, '../data/downloader')
const dbId = getSwarmHash()

describe('Downloader manager', () => {
  it('should download db and return correct status', async () => {
    const part1 = 'aaaaa'
    const reference1 = '1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const part2 = 'bbbbb'
    const reference2 = '2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const part3 = 'cc'
    const reference3 = '3aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const testMeta: DBInformation = {
      v: 1,
      dbVersion: 1,
      title: 'Hello',
      description: 'Hello world',
      blocks: [
        {
          id: 0,
          size: 5,
          swarmReference: reference1,
          sha256: 'ed968e840d10d2d313a870bc131a4e2c311d7ad09bdf32b3418147221f51a6e2',
        },
        {
          id: 0,
          size: 5,
          swarmReference: reference2,
          sha256: '5e846c64f2db12266e6b658a8e5b5b42cc225419b3ee1fca88acbb181ddfdb52',
        },
        {
          id: 0,
          size: 2,
          swarmReference: reference3,
          sha256: '355b1bbfc96725cdce8f4a2708fda310a80e6d13315aec4e5eed2a75fe8032ce',
        },
      ],
    }

    Bee.prototype.downloadData = async (
      reference: ReferenceOrEns,
      options?: RequestOptions | undefined,
    ): Promise<Data> => {
      // slowdown responses with timeout
      await sleep(500)

      if (reference === dbId) {
        return makeData(JSON.stringify(testMeta))
      } else if (reference === reference1) {
        return makeData(part1)
      } else if (reference === reference2) {
        return makeData(part2)
      } else if (reference === reference3) {
        return makeData(part3)
      }

      throw new Error('Unknown swarm reference')
    }

    cleanupDb(outDirectoryPath, dbId)
    const paths = getDbPaths(outDirectoryPath, dbId)
    Array.from([paths.dbDirectoryPath, paths.dbFilePath, paths.metaFilePath]).forEach(path => {
      expect(fs.existsSync(path)).toEqual(false)
    })

    const sleepTime = 1000
    startDownloaderManager({
      outputPath: outDirectoryPath,
      sleepTime,
      beeUrl: 'http://localhost:1633',
    }).then()

    const statusBeforeAdd = getDbStatus(dbId)
    expect(statusBeforeAdd).toEqual(DbStatus.NO_INFORMATION)
    addQueue({
      dbId,
    })
    const statusAfterAdd0 = getDbStatus(dbId)
    expect(statusAfterAdd0).toEqual(DbStatus.WAIT)
    await sleep(sleepTime + 1)
    const statusAfterAdd = getDbStatus(dbId)
    expect(statusAfterAdd).toEqual(DbStatus.DOWNLOADING)
    // some time more than all downloads (meta + each part) time
    await sleep(5000)
    const statusAfterSleep = getDbStatus(dbId)
    expect(statusAfterSleep).toEqual(DbStatus.DONE)
  })

  afterAll(() => {
    stopManager()
    cleanupDb(outDirectoryPath, dbId)
  })
})
