import { isSwarmReference } from '../../../src/shared/utils/swarm'

describe('function isSwarmReference', () => {
  it('should return true for valid input', () => {
    expect(isSwarmReference('a'.repeat(64))).toBe(true)
    expect(isSwarmReference('a'.repeat(128))).toBe(true)
  })

  it('should return false for invalid input', () => {
    expect(isSwarmReference('a'.repeat(63))).toBe(false)
    expect(isSwarmReference('a'.repeat(127))).toBe(false)
    expect(isSwarmReference('a'.repeat(65))).toBe(false)
    expect(isSwarmReference('a'.repeat(129))).toBe(false)
    expect(isSwarmReference('123')).toBe(false)
    expect(isSwarmReference('abc')).toBe(false)
  })
})
