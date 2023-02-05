import { DbDownloadingAllowanceType, SearchType, ServerConfig } from '../interfaces'
import { getDbDownloadingAllowanceType, getSearchTypeArray } from './interfaces'

/**
 * Default data for ServerConfig
 */
export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  searchTypes: [SearchType.AUTOCOMPLETE],
  mainPort: 7890,
  dbsPath: './',
  downloaderServerUrl: '',
  dbAllowanceType: DbDownloadingAllowanceType.ALLOWED_LIST,
  allowedDbIds: [''],
}

/**
 * Prepare string array from string or undefined
 */
export function prepareStringArray(data: string | undefined): string[] {
  if (typeof data === 'string') {
    return data.split(',').map(element => element.trim())
  } else {
    return []
  }
}

/**
 * Fill ServerConfig object
 */
export function fillConfig(): ServerConfig {
  const {
    SWARM_SEARCH_TYPES,
    SWARM_SEARCH_MAIN_PORT,
    SWARM_SEARCH_DBS_PATH,
    SWARM_SEARCH_DOWNLOADER_SERVER_URL,
    SWARM_SEARCH_DOWNLOAD_ALLOWANCE_TYPE,
    SWARM_SEARCH_ALLOWED_DBS,
  } = process.env
  const { searchTypes, mainPort, downloaderServerUrl, dbAllowanceType, allowedDbIds } = DEFAULT_SERVER_CONFIG

  return {
    searchTypes: getSearchTypeArray(prepareStringArray(SWARM_SEARCH_TYPES)) || searchTypes,
    mainPort: Number(SWARM_SEARCH_MAIN_PORT) || mainPort,
    dbsPath: SWARM_SEARCH_DBS_PATH ?? './',
    downloaderServerUrl: SWARM_SEARCH_DOWNLOADER_SERVER_URL || downloaderServerUrl,
    dbAllowanceType: SWARM_SEARCH_DOWNLOAD_ALLOWANCE_TYPE
      ? getDbDownloadingAllowanceType(SWARM_SEARCH_DOWNLOAD_ALLOWANCE_TYPE)
      : dbAllowanceType,
    allowedDbIds: prepareStringArray(SWARM_SEARCH_ALLOWED_DBS) || allowedDbIds,
  }
}

/**
 * Print any config
 */
export function printConfig(config: object, configExplainer?: (param: string) => string): void {
  // eslint-disable-next-line no-console
  console.log('===== Configuration info =====\n')
  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.log(`${configExplainer ? configExplainer(key) : key}: ${config[key]}`)
    }
  }
  // eslint-disable-next-line no-console
  console.log('\n===== End of configuration info =====\n')
}
