import { DbDownloadingAllowanceType, SearchType } from '../interfaces'

/**
 * Get SearchType from string
 */
export function getSearchType(type: string): SearchType {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Object.values(SearchType).includes(type)) {
    return type as SearchType
  } else {
    throw Error(`Search type "${type}" is not allowed`)
  }
}

/**
 * Get SearchType array from string array
 */
export function getSearchTypeArray(items: string[]): SearchType[] {
  return items.map(item => getSearchType(item))
}

/**
 * Get enum from string
 */
export function getDbDownloadingAllowanceType(type: string): DbDownloadingAllowanceType {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Object.values(DbDownloadingAllowanceType).includes(type)) {
    return type as DbDownloadingAllowanceType
  } else {
    throw Error(`DB Downloading type "${type}" is not allowed`)
  }
}
