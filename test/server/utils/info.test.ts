import { getStoredServerInfo } from '../../../src/server/utils/info'

describe('function getServerInfo', () => {
  it('should return data', () => {
    const data = getStoredServerInfo()
    expect(data.v).toBeDefined()
    expect(data.dbAllowanceType).toBeDefined()
    expect(data.maxSizeDbBytes).toBeDefined()
    expect(data.bytesAvailable).toBeDefined()
    expect(data.allowedSearchTypes).toBeDefined()
  })
})
