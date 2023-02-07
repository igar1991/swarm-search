import { SuggestResponse } from '../interfaces'
import { getDb } from './dbs'
import { getDbHelper } from '../../../test/utils/db'
import { DBSuggestResponse } from '../../shared/interfaces'
import { getServerConfig } from './info'

export const QUERY_MIN_LENGTH = 1
export const QUERY_MAX_LENGTH = 20
export const RESULT_MIN_LIMIT = 1
export const RESULT_MAX_LIMIT = 50

const likeQuery =
  'SELECT * FROM items WHERE name LIKE ? COLLATE NOCASE OR name LIKE ? COLLATE NOCASE OR name LIKE ? COLLATE NOCASE LIMIT ?;'

export function replaceAll(text: string, from: string, to: string): string {
  return text.split(from).join(to)
}

/**
 * Ask DB about suggestions
 */
export async function suggest(dbId: string, query: string, limit = 10): Promise<SuggestResponse> {
  if (limit < RESULT_MIN_LIMIT) {
    limit = RESULT_MIN_LIMIT
  }

  if (limit > RESULT_MAX_LIMIT) {
    limit = RESULT_MAX_LIMIT
  }

  const db = getDb(getServerConfig(), dbId)
  const { all } = getDbHelper(db)
  const query1 = query + '%'
  const query2 = replaceAll(query, ' ', '_') + '%'
  const query3 = replaceAll(query, ' ', '-') + '%'
  const resultResponse = (await all(likeQuery, [query1, query2, query3, limit.toString()])) as DBSuggestResponse[]
  const result = resultResponse.map(item => ({
    page: {
      relativeUrl: item.name,
      preview: item.text,
    },
  }))

  return {
    id: dbId,
    query,
    result,
  }
}

/**
 * Check suggest query
 */
export function checkSuggestQuery(query: string): void {
  if (!query || query.length < QUERY_MIN_LENGTH || query.length > QUERY_MAX_LENGTH) {
    throw new Error(
      `Incorrect length of suggest query. Min length is ${QUERY_MIN_LENGTH}, max length is ${QUERY_MAX_LENGTH}`,
    )
  }
}
