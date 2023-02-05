import sqlite3, { Database } from 'sqlite3'
import { join } from 'path'
import fs from 'fs'
import { startIndexer } from '../../src/indexer/app'
import { SEARCH_WIKI_TITLES } from '../../src/indexer/utils'

export interface SampleDbInfo {
  type: SampleDb
  id: string
  source: string
  outPath: string
  searchPath: string
  db?: Database
}

export enum SampleDb {
  suggest,
}

export const DBS_PATH = join(__dirname, '../data/suggest/out')
export const SAMPLE_DBS: SampleDbInfo[] = [
  {
    type: SampleDb.suggest,
    id: '1af5ef342907651bd7ac14f093ac2ec679111df795d87b4993edc07a38167abe',
    source: join(__dirname, '../data/suggest/en_wiki_voyage.txt'),
    outPath: join(DBS_PATH, `1af5ef342907651bd7ac14f093ac2ec679111df795d87b4993edc07a38167abe/sqlite.db`),
    searchPath: DBS_PATH,
  },
]

/**
 * Get sample DB info only
 */
export function getSampleDbInfo(type: SampleDb): SampleDbInfo {
  const item = SAMPLE_DBS.find(item => item.type === type)

  if (!item) {
    throw new Error('SampleDb is not found')
  }

  return item
}

/**
 * Get or create DB with index
 */
export async function getSampleDb(type: SampleDb): Promise<SampleDbInfo> {
  process.env.INDEXER_MUTE_PROCESS_LOGS = 'true'
  const item = getSampleDbInfo(type)

  if (!fs.existsSync(item.outPath)) {
    process.env.INDEXER_LINES_FILE_PATH = item.source
    process.env.INDEXER_OUTPUT_PATH = item.outPath
    process.env.INDEXER_SEARCH_TYPE = SEARCH_WIKI_TITLES
    await startIndexer()
  }

  if (!fs.existsSync(item.outPath)) {
    throw new Error('Can not find the db after indexing')
  }

  return { ...item, db: new sqlite3.Database(item.outPath) }
}
