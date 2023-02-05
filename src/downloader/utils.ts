import { assertSwarmReference } from '../shared/utils/swarm'
import { Bee } from '@ethersphere/bee-js'
import { DBInformation } from '../shared/db/interfaces'
import { checkMetaDbInformation } from '../uploader/utils'
import fs from 'fs'
import crypto from 'crypto'

/**
 * Download meta about db
 */
export async function downloadMeta(dbId: string, beeUrl: string): Promise<DBInformation> {
  const bee = new Bee(beeUrl)
  const meta = (await bee.downloadData(dbId)).json() as unknown as DBInformation
  checkMetaDbInformation(meta)

  return meta
}

/**
 * Download portions of the database file into one file with SHA256 validation
 */
export async function downloadDb(dbId: string, meta: DBInformation, outPath: string, beeUrl: string) {
  assertSwarmReference(dbId)
  const bee = new Bee(beeUrl)
  const fileOpen = fs.openSync(outPath, 'w')
  try {
    for (const block of meta.blocks) {
      const data = await bee.downloadData(block.swarmReference)

      if (data.length !== block.size) {
        throw new Error(
          `Size of the block is not correct. Actual size is ${data.length} bytes. ${JSON.stringify(block)}`,
        )
      }
      const sha256 = crypto.createHash('sha256').update(data).digest('hex')

      if (block.sha256.toLowerCase() !== sha256.toLowerCase()) {
        throw new Error(`sha256 is not equal. Calculated sha256: ${sha256}. Block info: ${JSON.stringify(block)}`)
      }

      fs.writeSync(fileOpen, data)
    }
  } catch (e) {
    const error = e as unknown as Error
    fs.closeSync(fileOpen)
    fs.unlinkSync(outPath)
    throw new Error(error.message)
  }

  fs.closeSync(fileOpen)
}
