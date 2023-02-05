import { SERVER_CONFIG_EXPLANATION, ServerConfig } from '../../shared/interfaces'
import fs from 'fs'

/**
 * Config explainer
 */
export function explainConfig(key: string): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const value = SERVER_CONFIG_EXPLANATION[key]

  if (!value) {
    throw new Error(`There is no config explanation for key ${key}`)
  }

  return value
}

/**
 * Check config
 */
export function checkConfig(config: ServerConfig): void {
  const isDbsPathExists = fs.existsSync(config.dbsPath)

  if (!config.downloaderServerUrl) {
    throw new Error(`${explainConfig('downloaderServerUrl')} should be defined`)
  }

  if (!isDbsPathExists) {
    throw new Error(`DBs path is not exists: ${config.dbsPath}`)
  }
}
