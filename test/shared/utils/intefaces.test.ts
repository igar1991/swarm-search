import { DbDownloadingAllowanceType, SearchType } from '../../../src/shared/interfaces'
import { getDbDownloadingAllowanceType, getSearchType, getSearchTypeArray } from '../../../src/shared/utils/interfaces'

describe('test methods', () => {
  it('getDbDownloadingAllowanceType', () => {
    expect(getDbDownloadingAllowanceType('any')).toBe(DbDownloadingAllowanceType.ANY)
    expect(getDbDownloadingAllowanceType('allowed_list')).toBe(DbDownloadingAllowanceType.ALLOWED_LIST)
    expect(() => getDbDownloadingAllowanceType('test')).toThrow('DB Downloading type "test" is not allowed')
  })

  it('getSearchType', () => {
    expect(getSearchType('a')).toBe(SearchType.AUTOCOMPLETE)
    expect(getSearchType('f')).toBe(SearchType.FULL_TEXT)
    expect(() => getSearchType('test')).toThrow('Search type "test" is not allowed')
  })

  it('getSearchTypeArray', () => {
    expect(getSearchTypeArray(['a', 'f'])).toStrictEqual([SearchType.AUTOCOMPLETE, SearchType.FULL_TEXT])
    expect(getSearchTypeArray(['a'])).toStrictEqual([SearchType.AUTOCOMPLETE])
    expect(getSearchTypeArray(['f'])).toStrictEqual([SearchType.FULL_TEXT])
    expect(getSearchTypeArray([])).toStrictEqual([])
    expect(() => getSearchTypeArray(['test'])).toThrow('Search type "test" is not allowed')
  })
})
