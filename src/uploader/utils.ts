import fs from 'fs'
import crypto from 'crypto'
import { DBBlock, DBInformation } from '../shared/db/interfaces'
import { Bee, Reference } from '@ethersphere/bee-js'

export const MAX_VERSION_VALUE = 10000
export const MIN_TITLE_LENGTH = 3
export const MAX_TITLE_LENGTH = 256
export const MIN_DESCRIPTION_LENGTH = 3
export const MAX_DESCRIPTION_LENGTH = 4096

export interface UploadDbFileInfo {
  fileInfo: DBInformation
  reference: Reference
}

export interface ConfigDescription {
  envPrefix: string
  items: ConfigItem[]
}

export interface ConfigItem {
  variableName: Variables
  envName: string
  defaultValue?: string
}

export enum Variables {
  beeUrl,
  beeStamp,
  dbName,
  dbDescription,
  dbFilePath,
  splitBlockSize,
}

export type ConfigValues = {
  [key in keyof typeof Variables]: string
}

export const CONFIG_DESCRIPTION: ConfigDescription = {
  envPrefix: 'UPLOADER_',
  items: [
    {
      variableName: Variables.beeUrl,
      envName: 'BEE_URL',
      defaultValue: 'http://localhost:1633',
    },
    {
      variableName: Variables.beeStamp,
      envName: 'BEE_STAMP',
    },
    {
      variableName: Variables.dbName,
      envName: 'DB_NAME',
    },
    {
      variableName: Variables.dbDescription,
      envName: 'DB_DESCRIPTION',
    },
    {
      variableName: Variables.dbFilePath,
      envName: 'DB_FILE_PATH',
    },
    {
      variableName: Variables.splitBlockSize,
      envName: 'SPLIT_BLOCK_SIZE',
      defaultValue: '1000000',
    },
  ],
}

/**
 * Check DB information
 */
export function checkMetaDbInformation(info: DBInformation): void {
  if (info.v <= 0 || info.v > MAX_VERSION_VALUE) {
    throw new Error('Incorrect version of metadata')
  }

  if (info.dbVersion <= 0 || info.dbVersion > MAX_VERSION_VALUE) {
    throw new Error('Incorrect version of db')
  }

  if (info.title.length < MIN_TITLE_LENGTH || info.title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Incorrect length of title. Supported length from ${MIN_TITLE_LENGTH} to ${MAX_TITLE_LENGTH}`)
  }

  if (info.description.length < MIN_DESCRIPTION_LENGTH || info.description.length > MAX_DESCRIPTION_LENGTH) {
    throw new Error(
      `Incorrect length of description. Supported length from ${MIN_DESCRIPTION_LENGTH} to ${MAX_DESCRIPTION_LENGTH}`,
    )
  }

  if (!info.blocks.length) {
    throw new Error('Empty blocks array')
  }

  for (const block of info.blocks) {
    if (block.id < 0) {
      throw new Error('Block is should more or equal 0')
    }

    if (block.size <= 0) {
      throw new Error('Size of block should be more than 0')
    }

    if (!block.sha256) {
      throw new Error('sha256 of the block should be defined')
    }

    if (!block.swarmReference) {
      throw new Error('swarmReference of the block should be defined')
    }
  }
}

/**
 * Fill config data from environment
 */
export function fillConfig(): ConfigValues {
  const result: ConfigValues = {
    beeUrl: '',
    beeStamp: '',
    dbName: '',
    dbDescription: '',
    dbFilePath: '',
    splitBlockSize: '',
  }
  for (const item of CONFIG_DESCRIPTION.items) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[Variables[item.variableName]] =
      process.env[CONFIG_DESCRIPTION.envPrefix + item.envName] ?? item.defaultValue ?? ''
  }

  return result
}

/**
 * Print config names and values
 */
export function printConfig(config: ConfigValues): void {
  for (const item of CONFIG_DESCRIPTION.items) {
    const fullEnvKey = CONFIG_DESCRIPTION.envPrefix + item.envName
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-console
    console.log(`${fullEnvKey}: ${config[Variables[item.variableName]]}`)
  }
}

/**
 * Check configs are correct
 */
export function checkConfig(config: ConfigValues): void {
  if (!config.dbName) {
    throw new Error('Empty db name')
  }

  if (!config.dbDescription) {
    throw new Error('Empty db description')
  }

  if (!config.splitBlockSize || Number(config.splitBlockSize) <= 0) {
    throw new Error('Split block size should be positive number')
  }

  if (!fs.existsSync(config.dbFilePath)) {
    throw new Error('File with db not found')
  }

  if (!config.beeUrl) {
    throw new Error('Bee url should be defined')
  }

  if (!config.beeStamp) {
    throw new Error('Bee stamp should be defined')
  }
}

/**
 * Upload file blocks and metadata to Swarm
 */
export async function uploadDbFile(
  fileInfo: DBInformation,
  configValues: ConfigValues,
  onBlockUploading: (blockIndex: number, totalBlocks: number) => void,
): Promise<UploadDbFileInfo> {
  const bee = new Bee(configValues.beeUrl)
  const blockSize = Number(configValues.splitBlockSize)

  if (blockSize <= 0) {
    throw new Error('Incorrect block size. It should be positive')
  }
  const fileSize = fs.statSync(configValues.dbFilePath).size
  const blocksCount = Math.ceil(fileSize / blockSize)
  const blocks: DBBlock[] = []
  const fileOpen = fs.openSync(configValues.dbFilePath, 'r')

  for (let i = 0; i < blocksCount; i++) {
    const offset = i * blockSize
    const sizeToRead = Math.min(fileSize - offset, blockSize)
    const buffer = Buffer.alloc(sizeToRead)
    fs.readSync(fileOpen, buffer, 0, sizeToRead, offset)
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex')
    const swarmReference = (await bee.uploadData(configValues.beeStamp, buffer)).reference
    blocks.push({
      id: i,
      size: sizeToRead,
      swarmReference,
      sha256,
    })

    onBlockUploading(i + 1, blocksCount)
  }

  fs.closeSync(fileOpen)
  fileInfo.blocks = blocks

  return {
    fileInfo,
    reference: (await bee.uploadData(configValues.beeStamp, JSON.stringify(fileInfo))).reference,
  }
}
