import express from 'express'
import { DbId, DownloaderStatusResponse } from '../interfaces'
import { DbStatus, getDbStatus, getError } from '../downloader'

const router = express.Router()
router.get('/', async (req, res, next) => {
  try {
    const query = req.query as unknown as DbId
    const { id } = query

    const status = getDbStatus(id)
    let message = ''

    if (status === DbStatus.ERROR) {
      message = getError(id)
    }
    const result: DownloaderStatusResponse = {
      id,
      result: DbStatus[status],
      message,
    }
    res.json(result)
  } catch (e) {
    next(e)
  }
})

export default router
