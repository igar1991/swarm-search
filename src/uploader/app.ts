import { checkConfig, fillConfig, printConfig, uploadDbFile } from './utils'
import { DBInformation } from '../shared/db/interfaces'

export async function startUploader() {
  const config = fillConfig()
  const dbInfo: DBInformation = {
    v: 1,
    dbVersion: 1,
    title: config.dbName,
    description: config.dbDescription,
    blocks: [],
  }

  printConfig(config)
  checkConfig(config)
  // eslint-disable-next-line no-console
  console.log('Uploading started!')
  const result = await uploadDbFile(dbInfo, config, (blockIndex, totalBlocks) => {
    // eslint-disable-next-line no-console
    console.log(`Block uploaded: ${blockIndex}/${totalBlocks}!`)
  })
  // eslint-disable-next-line no-console
  console.log(`DB uploaded! Sharing reference: ${result.reference}`)
}
