import { sleep } from '../shared/utils'
import { join } from 'path'
import { DEFAULT_DB_FILE_NAME, DEFAULT_META_NAME } from '../shared/const'
import fs from 'fs'
import { downloadDb, downloadMeta } from './utils'
import { assertSwarmReference } from '../shared/utils/swarm'

const queue: QueueTask[] = []
const errors: ErrorDescription = {}
let isStopManager = false
let managerConfig: ManagerConfig
let activeTask: QueueTask | null

export interface ErrorDescription {
  [key: string]: string
}

export interface ManagerConfig {
  // path where dbs will be stored
  outputPath: string
  // sleep time between checking queue
  sleepTime: number
  // bee node api url
  beeUrl: string
}

export interface QueueTask {
  dbId: string
}

export interface DbPaths {
  dbDirectoryPath: string
  dbFilePath: string
  metaFilePath: string
}

/**
 * Status of db
 */
export enum DbStatus {
  // some error
  ERROR,
  // no information about db id
  NO_INFORMATION,
  // wait of processing
  WAIT,
  // downloading in progress
  DOWNLOADING,
  // downloading done
  DONE,
}

/**
 * Get information about db
 */
export function getDbStatus(id: string): DbStatus {
  assertSwarmReference(id)

  if (activeTask?.dbId === id) {
    return DbStatus.DOWNLOADING
  }

  if (queue.find(item => item.dbId === id)) {
    return DbStatus.WAIT
  }

  const dbFullPath = join(managerConfig.outputPath, id, DEFAULT_DB_FILE_NAME)

  if (fs.existsSync(dbFullPath)) {
    return DbStatus.DONE
  } else {
    if (errors[id]) {
      return DbStatus.ERROR
    } else {
      return DbStatus.NO_INFORMATION
    }
  }
}

export function getError(id: string): string {
  assertSwarmReference(id)

  return errors[id]
}

/**
 * Add to queue
 */
export function addQueue(task: QueueTask): void {
  assertSwarmReference(task.dbId)
  queue.push(task)
}

export function getDbPaths(outputPath: string, id: string): DbPaths {
  const dbPath = join(outputPath, id)
  const dbFullPath = join(dbPath, DEFAULT_DB_FILE_NAME)
  const metaPath = join(dbPath, DEFAULT_META_NAME)

  return {
    dbDirectoryPath: dbPath,
    dbFilePath: dbFullPath,
    metaFilePath: metaPath,
  }
}

function setError(id: string, text: string) {
  assertSwarmReference(id)
  errors[id] = text
}

/**
 * Process task of the queue
 */
async function processTask(task: QueueTask): Promise<void> {
  const paths = getDbPaths(managerConfig.outputPath, task.dbId)

  if (fs.existsSync(paths.dbFilePath)) {
    const error = 'DB file already exists'
    setError(task.dbId, error)
    throw new Error(error)
  }

  if (!fs.existsSync(paths.dbDirectoryPath)) {
    fs.mkdirSync(paths.dbDirectoryPath)
  }

  activeTask = task
  const meta = await downloadMeta(task.dbId, managerConfig.beeUrl)
  fs.writeFileSync(paths.metaFilePath, JSON.stringify(meta))
  await downloadDb(task.dbId, meta, paths.dbFilePath, managerConfig.beeUrl)
  activeTask = null
}

/**
 * Start manager which check queue and process items
 */
export async function startDownloaderManager(config: ManagerConfig): Promise<void> {
  process.on('SIGINT', () => {
    stopManager()
  })

  activeTask = null
  managerConfig = config
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (isStopManager) {
      isStopManager = false
      break
    }

    const task = queue.pop()

    if (task) {
      try {
        await processTask(task)
      } catch (e) {
        activeTask = null
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setError(task.dbId, e.message)
        cleanupDb(managerConfig.outputPath, task.dbId)
        const error = e as unknown as Error
        // eslint-disable-next-line no-console
        console.log(`Error during processing queue ${JSON.stringify(task)}. ${error.message}`)
      }
    }

    await sleep(managerConfig.sleepTime)
  }
}

/**
 * Stop manager
 */
export function stopManager() {
  isStopManager = true
}

/**
 * Clean up db directory and files
 */
export function cleanupDb(outputPath: string, id: string) {
  assertSwarmReference(id)
  const path = join(outputPath, id)
  fs.rmSync(path, { recursive: true, force: true })
}
