import sqlite3 from 'sqlite3'
import {
  checkConfig,
  explainConfig,
  getAppConfig,
  getDbHelper,
  scanFiles,
  ScanFilesProcessData,
  ScanLinesProcessData,
  scanWikiTitlesFile,
  SEARCH_FILES,
  SEARCH_WIKI_TITLES,
} from './utils'
import { printConfig } from '../shared/utils/config'
import { createFullPath, getParentPath, isParentPathExists } from '../../test/utils/db'
import dotenv from 'dotenv'

function processLog(text: string, isMute: boolean): void {
  if (!isMute) {
    // eslint-disable-next-line no-console
    console.log(text)
  }
}

export async function startIndexer() {
  dotenv.config()
  const config = getAppConfig()
  printConfig(config, explainConfig)
  checkConfig(config)

  if (!isParentPathExists(config.outputDbPath)) {
    createFullPath(getParentPath(config.outputDbPath))
  }
  const db = new sqlite3.Database(config.outputDbPath)
  const { run } = getDbHelper(db)

  await run('CREATE TABLE items (name VARCHAR PRIMARY KEY, text TEXT)', [])
  await run('CREATE INDEX text_index ON items (text)', [])

  const onFileProcess = async (data: ScanFilesProcessData) => {
    await run('INSERT INTO items (name, text) VALUES (?, ?)', [data.name, data.text])
    // eslint-disable-next-line no-console
    processLog(data.logMessage, config.muteProcessLogs)
  }

  const onLineProcess = async (data: ScanLinesProcessData) => {
    const valuesTemplate = data.lines.map(() => '(?, ?)').join(',')
    const value = data.lines.map(item => [item, '']).flat()
    await run(`INSERT INTO items (name, text) VALUES ${valuesTemplate}`, value)
    // eslint-disable-next-line no-console
    processLog(data.logMessage, config.muteProcessLogs)
  }

  if (config.searchType === SEARCH_FILES) {
    await scanFiles({
      searchPath: config.searchPath,
      searchPattern: '.txt',
      startPosition: config.startPosition,
      onProcess: onFileProcess,
    })
  } else if (config.searchType === SEARCH_WIKI_TITLES) {
    await scanWikiTitlesFile({
      batch: 1000,
      filePath: config.linesFilePath,
      startPosition: config.startPosition,
      onProcess: onLineProcess,
    })
  }

  // eslint-disable-next-line no-console
  console.log('Done!')
  db.close()
}
