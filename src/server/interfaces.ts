export interface IdQuery {
  /**
   * ID of DB (swarm hash)
   */
  id: string
}

/**
 * Suggest query
 */
export interface SuggestQuery extends IdQuery {
  /**
   * User's query
   */
  q: string
}

/**
 * Page description of suggest result
 */
export interface SuggestResult {
  page: {
    relativeUrl: string
    preview: string
  }
}

/**
 * Response to SuggestQuery
 */
export interface SuggestResponse extends IdQuery {
  query: string
  result: SuggestResult[]
}
