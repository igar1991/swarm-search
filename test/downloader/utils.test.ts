import { join } from 'path'
import { Bee, Data, ReferenceOrEns, RequestOptions, Utils } from '@ethersphere/bee-js'
import { downloadDb, downloadMeta } from '../../src/downloader/utils'
import { getSwarmHash } from '../utils/data'
import { DBInformation } from '../../src/shared/db/interfaces'
import fs from 'fs'
import { deleteFileIfExists } from '../../src/shared/utils/file'

describe('downloader utils', () => {
  it('test downloadDb', async () => {
    const outPath = join(__dirname, '../data/temp.bin')
    deleteFileIfExists(outPath)

    const dbId = getSwarmHash()
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
    const makeData = (data: string): Data => {
      function wrapBytesWithHelpers(data: Uint8Array): Data {
        return Object.assign(data, {
          text: () => new TextDecoder('utf-8').decode(data),
          json: () => JSON.parse(new TextDecoder('utf-8').decode(data)),
          hex: () => Utils.bytesToHex(data),
        })
      }

      return wrapBytesWithHelpers(new TextEncoder().encode(data))
    }
    Bee.prototype.downloadData = async (
      reference: ReferenceOrEns,
      options?: RequestOptions | undefined,
    ): Promise<Data> => {
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

    const beeUrl = 'http://localhost:1633'
    const meta = await downloadMeta(dbId, beeUrl)
    await downloadDb(dbId, meta, outPath, beeUrl)
    expect(fs.readFileSync(outPath).toString()).toEqual(part1 + part2 + part3)
    deleteFileIfExists(outPath)
  })
})
