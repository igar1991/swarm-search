import { ConfigValues, fillConfig, uploadDbFile } from '../../src/uploader/utils'
import { join } from 'path'
import { BatchId, Bee, UploadOptions, UploadResult } from '@ethersphere/bee-js'

describe('uploader utils', () => {
  it('test uploadDbFile', async () => {
    const testReference = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const filePath = join(__dirname, '../data/uploader/test.txt')
    const dbTitle = 'My DB'
    const dbDescription = 'My DB with description'
    const dataFileInfo = {
      v: 1,
      dbVersion: 1,
      title: dbTitle,
      description: dbDescription,
      blocks: [],
    }
    const configValues: ConfigValues = {
      beeUrl: 'http://localhost:1633',
      beeStamp: '',
      dbName: '',
      dbDescription: '',
      dbFilePath: filePath,
      splitBlockSize: '5',
      startUploadBlock: '1',
    }
    Bee.prototype.uploadData = async (
      postageBatchId: string | BatchId,
      data: Uint8Array,
      options?: UploadOptions | undefined,
    ): Promise<UploadResult> => {
      return { reference: testReference, tagUid: 1 } as UploadResult
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const result = await uploadDbFile(dataFileInfo, configValues, () => {})
    const { fileInfo } = result
    expect(result.reference).toEqual(testReference)
    expect(fileInfo.v).toEqual(1)
    expect(fileInfo.dbVersion).toEqual(1)
    expect(fileInfo.title).toEqual(dbTitle)
    expect(fileInfo.description).toEqual(dbDescription)
    expect(fileInfo.blocks).toHaveLength(4)
    expect(fileInfo.blocks[0]).toEqual({
      id: 0,
      size: 5,
      swarmReference: testReference,
      sha256: 'd17f25ecfbcc7857f7bebea469308be0b2580943e96d13a3ad98a13675c4bfc2',
    })
    expect(fileInfo.blocks[1]).toEqual({
      id: 1,
      size: 5,
      swarmReference: testReference,
      sha256: 'cc399d73903f06ee694032ab0538f05634ff7e1ce5e8e50ac330a871484f34cf',
    })
    expect(fileInfo.blocks[2]).toEqual({
      id: 2,
      size: 5,
      swarmReference: testReference,
      sha256: '216e683ff0d2d25165b8bb7ba608c9a628ef299924ca49ab981ec7d2fecd6dad',
    })
    expect(fileInfo.blocks[3]).toEqual({
      id: 3,
      size: 2,
      swarmReference: testReference,
      sha256: '71ee45a3c0db9a9865f7313dd3372cf60dca6479d46261f3542eb9346e4a04d6',
    })
  })

  it('test fillConfig', () => {
    process.env.UPLOADER_BEE_URL = '1'
    process.env.UPLOADER_BEE_STAMP = '2'
    process.env.UPLOADER_DB_NAME = '3'
    process.env.UPLOADER_DB_DESCRIPTION = '4'
    process.env.UPLOADER_DB_FILE_PATH = '5'
    process.env.UPLOADER_SPLIT_BLOCK_SIZE = '6'

    const result = fillConfig()
    expect(result.beeUrl).toEqual('1')
    expect(result.beeStamp).toEqual('2')
    expect(result.dbName).toEqual('3')
    expect(result.dbDescription).toEqual('4')
    expect(result.dbFilePath).toEqual('5')
    expect(result.splitBlockSize).toEqual('6')
  })
})
