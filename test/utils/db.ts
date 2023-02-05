import sqlite3, { Database, RunResult } from 'sqlite3'
import fs from 'fs'
import path from 'path'

export interface DbMethods {
  run: (sql: string, params: string[]) => Promise<RunResult>
  get: (sql: string, params: string[]) => Promise<any>
  all: (sql: string, params: string[]) => Promise<any>
}

export async function getRowsCount(dbPath: string, tableName: string): Promise<number> {
  const db = new sqlite3.Database(dbPath)
  const { get } = getDbHelper(db)
  const result = await get(`SELECT COUNT(*) as count FROM ${tableName}`, [])

  if (!result.count) {
    throw new Error('Count data not found')
  }

  if (!Number.isInteger(result.count)) {
    throw new Error('Count is not a number')
  }

  return result.count
}

export function getDbHelper(db: Database): DbMethods {
  const run = async (sql: string, params: string[]): Promise<RunResult> => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (result: RunResult, error: Error) => {
        if (error) {
          reject(error)

          return
        }

        resolve(result)
      })
    })
  }

  const get = async (sql: string, params: string[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const statement = db.prepare(sql, params)
      statement.get((error: Error, result: any) => {
        if (error) {
          reject(error)

          return
        }

        resolve(result)
      })
    })
  }

  const all = async (sql: string, params: string[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const statement = db.prepare(sql, params)
      statement.all((error: Error, result: any) => {
        if (error) {
          reject(error)

          return
        }

        resolve(result)
      })
    })
  }

  return { run, get, all }
}

/**
 * Get parent path/dirname of the path
 */
export function getParentPath(fullPath: string): string {
  return path.dirname(fullPath)
}

/**
 * Check that parent path of the path is exists
 */
export function isParentPathExists(path: string): boolean {
  return fs.existsSync(getParentPath(path))
}

/**
 * Create full path recursively
 */
export function createFullPath(path: string): void {
  fs.mkdirSync(path, { recursive: true })
}
