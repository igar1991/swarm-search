import { SearchType, ServerConfig, PublicServerInformation } from '../../shared/interfaces'
import { VERSION } from '../../shared/const'
import { DEFAULT_SERVER_CONFIG } from '../../shared/utils/config'

export let serverConfig: ServerConfig

export function getServerConfig(): ServerConfig {
  if (!serverConfig) {
    throw new Error('Server config was not initialized')
  }

  return serverConfig
}

export function storeServerConfig(newConfig: ServerConfig): void {
  serverConfig = newConfig
}

/**
 * Get public information about server
 */
export function getStoredServerInfo(): PublicServerInformation {
  const config = serverConfig ?? DEFAULT_SERVER_CONFIG

  return {
    v: VERSION,
    dbAllowanceType: config.dbAllowanceType,
    // todo get from downloader config or by api
    maxSizeDbBytes: 0,
    // todo calculate available bytes and minus them from total allowed
    bytesAvailable: 0,
    // todo get from config
    allowedSearchTypes: [{ type: SearchType.AUTOCOMPLETE, title: 'Autocomplete' }],
  }
}
