export interface DbId {
  id: string
}

/**
 * Download response
 */
export interface DownloaderDownloadResponse extends DbId {
  // DbStatus enum in string representation
  result: string
}

/**
 * Status response
 */
export interface DownloaderStatusResponse extends DbId {
  // DbStatus enum in string representation
  result: string
  message: string
}
