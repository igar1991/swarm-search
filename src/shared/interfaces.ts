export interface DBSuggestResponse {
  name: string
  text: string
}

/**
 * Data from server configuration file
 */
export interface ServerConfig {
  /**
   * Allowed search types
   */
  searchTypes: SearchType[]
  /**
   * Port for main server
   */
  mainPort: number
  /**
   * Downloader server url
   */
  downloaderServerUrl: string
  /**
   * Path where DBs should be stored. To load already downloaded DBs on start
   */
  dbsPath: string
  /**
   * Allowance of DB downloading
   */
  dbAllowanceType: DbDownloadingAllowanceType
  /**
   * Allowed DB IDs
   */
  allowedDbIds: string[]
}

type ServerConfigObject = {
  [key in keyof ServerConfig]: string
}

export const SERVER_CONFIG_EXPLANATION: ServerConfigObject = {
  searchTypes: 'SWARM_SEARCH_TYPES',
  mainPort: 'SWARM_SEARCH_MAIN_PORT',
  downloaderServerUrl: 'SWARM_SEARCH_DOWNLOADER_SERVER_URL',
  dbsPath: 'SWARM_SEARCH_DBS_PATH',
  dbAllowanceType: 'SWARM_SEARCH_DOWNLOAD_ALLOWANCE_TYPE',
  allowedDbIds: 'SWARM_SEARCH_ALLOWED_DBS',
}

/**
 * Public server information
 */
export interface PublicServerInformation {
  /**
   * Server's version
   */
  v: string
  /**
   * Allowance of DB downloading
   */
  dbAllowanceType: DbDownloadingAllowanceType
  /**
   * Max size of a DB
   */
  maxSizeDbBytes: number
  /**
   * Bytes available for new DBs
   */
  bytesAvailable: number
  /**
   * Allowed search types
   */
  allowedSearchTypes: { type: string; title: string }[]
}

/**
 * Types of search
 */
export enum SearchType {
  AUTOCOMPLETE = 'a',
  FULL_TEXT = 'f',
}

/**
 * Defines which DBs allowed for downloading
 */
export enum DbDownloadingAllowanceType {
  // any DB allowed for downloading
  ANY = 'any',
  // downloading allowed only from specified list
  ALLOWED_LIST = 'allowed_list',
}
