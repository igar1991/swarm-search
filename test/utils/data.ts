import { Data, Utils } from '@ethersphere/bee-js'

export function getSwarmHash(encrypted = false): string {
  if (encrypted) {
    return 'a'.repeat(128)
  } else {
    return 'a'.repeat(64)
  }
}

export const makeData = (data: string): Data => {
  function wrapBytesWithHelpers(data: Uint8Array): Data {
    return Object.assign(data, {
      text: () => new TextDecoder('utf-8').decode(data),
      json: () => JSON.parse(new TextDecoder('utf-8').decode(data)),
      hex: () => Utils.bytesToHex(data),
    })
  }

  return wrapBytesWithHelpers(new TextEncoder().encode(data))
}
