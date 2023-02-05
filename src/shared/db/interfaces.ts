export interface DBInformation {
  v: number
  dbVersion: number
  title: string
  description: string
  blocks: DBBlock[]
}

export interface DBBlock {
  id: number
  size: number
  swarmReference: string
  sha256: string
}
