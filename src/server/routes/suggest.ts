import express from 'express'
import { SuggestQuery } from '../interfaces'
import { checkSuggestQuery, suggest } from '../utils/suggest'
import { assertDbUsingAllowed } from '../utils/dbs'
import { getServerConfig } from '../utils/info'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const query = req.query as unknown as SuggestQuery
    const { id, q } = query

    assertDbUsingAllowed(getServerConfig(), id)
    checkSuggestQuery(q)
    res.json(await suggest(id, q))
  } catch (e) {
    next(e)
  }
})

export default router
