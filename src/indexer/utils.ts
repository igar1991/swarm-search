import { Database, RunResult } from 'sqlite3'
import fs from 'fs'
import path from 'path'
import LineByLineReader from 'line-by-line'

export interface DbMethods {
  run: (sql: string, data: string[]) => Promise<RunResult>
}

export interface ScanFilesOptions {
  searchPath: string
  searchPattern: string
  startPosition: number
  onProcess: (data: ScanFilesProcessData) => void
}

export interface ScanFilesProcessData {
  logMessage: string
  name: string
  text: string
}

export interface ScanLinesOptions {
  batch: number
  filePath: string
  startPosition: number
  onProcess: (data: ScanLinesProcessData) => void
}

export interface ScanLinesProcessData {
  logMessage: string
  lines: string[]
}

/**
 * Application configuration
 */
export interface AppConfig {
  /**
   * Where search text files. For scanning files search type
   */
  searchPath: string
  /**
   * File path with titles
   */
  linesFilePath: string
  /**
   * Db file output path
   */
  outputDbPath: string
  /**
   * Override db or not
   */
  overrideDb: boolean
  /**
   * Start position in index of found files that will be inserted
   */
  startPosition: number
  /**
   * Search type
   */
  searchType: string
  /**
   * Mute process logs
   */
  muteProcessLogs: boolean
}

type AppConfigObject = {
  [key in keyof AppConfig]: string
}

export const SEARCH_WIKI_TITLES = 'wiki_titles'
export const SEARCH_FILES = 'files'
export const ALLOWED_SEARCH_TYPES = [SEARCH_WIKI_TITLES, SEARCH_FILES]

export const EXPLANATION: AppConfigObject = {
  searchPath: 'INDEXER_SEARCH_PATH',
  linesFilePath: 'INDEXER_LINES_FILE_PATH',
  outputDbPath: 'INDEXER_OUTPUT_PATH',
  overrideDb: 'INDEXER_OVERRIDE_DB',
  startPosition: 'INDEXER_START_POSITION',
  searchType: 'INDEXER_SEARCH_TYPE',
  muteProcessLogs: 'INDEXER_MUTE_PROCESS_LOGS',
}

/**
 * Methods wrapped in a Promise
 */
export function getDbHelper(db: Database): DbMethods {
  const run = async (sql: string, data: string[]): Promise<RunResult> => {
    return new Promise((resolve, reject) => {
      db.run(sql, data, (result: RunResult, error: Error) => {
        if (error) {
          reject(error)

          return
        }

        resolve(result)
      })
    })
  }

  return { run }
}

export function getAppConfig(): AppConfig {
  return {
    searchPath: process.env[EXPLANATION.searchPath] ?? './data',
    linesFilePath: process.env[EXPLANATION.linesFilePath] ?? '',
    outputDbPath: process.env[EXPLANATION.outputDbPath] ?? './INDEXED_OUTPUT.db',
    overrideDb: process.env[EXPLANATION.overrideDb] === 'true',
    startPosition: Number(process.env[EXPLANATION.startPosition] ?? 0),
    searchType: process.env[EXPLANATION.searchType] ?? SEARCH_WIKI_TITLES,
    muteProcessLogs: process.env[EXPLANATION.muteProcessLogs] === 'true',
  }
}

/**
 * Check config conditions
 */
export function checkConfig(config: AppConfig): void {
  const isSearchPathExists = fs.existsSync(config.searchPath)
  const isLinesFilePathExists = fs.existsSync(config.linesFilePath)
  const isDbExists = fs.existsSync(config.outputDbPath)

  if (config.searchType === SEARCH_FILES && !isSearchPathExists) {
    throw new Error('Search path was not found')
  } else if (config.searchType === SEARCH_WIKI_TITLES && !isLinesFilePathExists) {
    throw new Error('Lines file path was not found')
  } else if (!config.overrideDb && isDbExists) {
    throw new Error('DB already exists and cannot be overwritten by configuration')
  } else if (!Number.isInteger(config.startPosition)) {
    throw new Error('Start position should be integer')
  } else if (Number.isInteger(config.startPosition) && config.startPosition < 0) {
    throw new Error('Start position can not be less than zero')
  } else if (!ALLOWED_SEARCH_TYPES.includes(config.searchType)) {
    throw new Error('Search type is now allowed')
  }

  if (config.overrideDb && isDbExists) {
    fs.unlinkSync(config.outputDbPath)
  }
}

/**
 * Config explainer
 */
export function explainConfig(key: string): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const value = EXPLANATION[key]

  if (!value) {
    throw new Error(`There is no config explanation for key ${key}`)
  }

  return value
}

/**
 * Scan filesystem's files
 */
export async function scanFiles(options: ScanFilesOptions): Promise<void> {
  const files = fs.readdirSync(options.searchPath)
  const items = files.slice(options.startPosition).entries()
  for (const [i, file] of items) {
    const filePath = path.resolve(path.join(options.searchPath, file))
    const name = path.basename(filePath, options.searchPattern)
    const text = fs.readFileSync(filePath, 'utf8')

    await options.onProcess({
      logMessage: `Processed ${i + 1 + options.startPosition}/${files.length}`,
      name,
      text,
    })
  }
}

/**
 * Scan wiki titles file. One by one line
 */
export async function scanWikiTitlesFile(options: ScanLinesOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new LineByLineReader(options.filePath)
    const batch: string[] = []

    let lines = 0
    reader.on('line', async line => {
      if (line !== 'page_title') {
        reader.pause()
        batch.push(line)

        if (batch.length >= options.batch) {
          await options.onProcess({
            logMessage: `Processing lines on index ${lines}`,
            lines: batch,
          })
          batch.length = 0
        }

        reader.resume()
      }

      lines++
    })
    reader.on('error', reject)
    reader.on('end', async () => {
      await options.onProcess({
        logMessage: `Processing lines on index ${lines}`,
        lines: batch,
      })
      batch.length = 0
      resolve()
    })
  })
}
