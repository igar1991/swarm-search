import sqlite3, { Database } from 'sqlite3'
import { DbDownloadingAllowanceType, ServerConfig } from '../../shared/interfaces'
import fs from 'fs'
import { assertSwarmReference } from '../../shared/utils/swarm'
import { join } from 'path'
import { DEFAULT_DB_FILE_NAME } from '../../shared/const'

export let dbs: { [key: string]: Database } = {}

/**
 * Loads DBs
 */
export function loadDbs(config: ServerConfig): void {
  dbs = {}

  if (!fs.existsSync(config.dbsPath)) {
    throw new Error('DBs path is not exists')
  }

  if (config.dbAllowanceType === DbDownloadingAllowanceType.ALLOWED_LIST && !config.allowedDbIds.length) {
    throw new Error(
      `Allowance type "${DbDownloadingAllowanceType.ALLOWED_LIST.toString()}" received, but db ids are empty`,
    )
  } else if (config.dbAllowanceType !== DbDownloadingAllowanceType.ALLOWED_LIST) {
    throw new Error(
      `Loading dbs with type other than "${DbDownloadingAllowanceType.ALLOWED_LIST.toString()}" is not allowed`,
    )
  }

  config.allowedDbIds.forEach(allowedId => {
    assertSwarmReference(allowedId)

    // if file not exists - it is ok, it could be created later
    if (!isDbExists(config.dbsPath, allowedId)) {
      return
    }

    loadDb(config.dbsPath, allowedId)
  })
}

function isDbExists(dbsPath: string, id: string): boolean {
  const path = join(dbsPath, id, DEFAULT_DB_FILE_NAME)

  return fs.existsSync(path)
}

function createDbInstance(dbsPath: string, id: string): Database {
  const path = join(dbsPath, id, DEFAULT_DB_FILE_NAME)

  return new sqlite3.Database(path)
}

function loadDb(dbsPath: string, id: string): void {
  dbs[id] = createDbInstance(dbsPath, id)
}

/**
 * Check is DB available
 */
export function isDbInstanceAvailable(id: string): boolean {
  assertSwarmReference(id)

  return Boolean(dbs[id])
}

export function assertDbUsingAllowed(config: ServerConfig, id: string): asserts config is ServerConfig {
  if (!isDbUsingAllowed(config, id)) {
    throw new Error(`Using db "${id}" is not allowed by the server config`)
  }
}

/**
 * Get loaded DB by id
 */
export function getDb(config: ServerConfig, id: string): Database {
  assertSwarmReference(id)
  assertDbUsingAllowed(config, id)

  if (!isDbInstanceAvailable(id)) {
    if (isDbExists(config.dbsPath, id)) {
      loadDb(config.dbsPath, id)
    } else {
      throw new Error(`Db "${id}" is not available`)
    }
  }

  return dbs[id]
}

/**
 * Check is DB id allowed to be downloaded
 */
export function isDbUsingAllowed(config: ServerConfig, id: string): boolean {
  assertSwarmReference(id)

  if (config.dbAllowanceType === DbDownloadingAllowanceType.ANY) {
    return true
  } else if (config.dbAllowanceType === DbDownloadingAllowanceType.ALLOWED_LIST) {
    return config.allowedDbIds.includes(id)
  } else {
    throw new Error('Incorrect db allowance type')
  }
}
