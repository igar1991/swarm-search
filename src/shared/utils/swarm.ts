/**
 * Checks is correct swarm reference
 */
export function isSwarmReference(input: string): boolean {
  return /^[a-fA-F0-9]{64}$|^[a-fA-F0-9]{128}$/.test(input)
}

export function assertSwarmReference(value: unknown): asserts value is string {
  if (!(typeof value === 'string' && isSwarmReference(value))) {
    throw new Error(`Incorrect SWARM reference: ${value}`)
  }
}
