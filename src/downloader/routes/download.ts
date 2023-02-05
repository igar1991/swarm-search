import express from 'express'
import { DbId, DownloaderDownloadResponse } from '../interfaces'
import { addQueue, DbStatus, getDbStatus } from '../downloader'

const router = express.Router()
router.post('/', async (req, res, next) => {
  try {
    const query = req.body as unknown as DbId
    const { id } = query

    let result: DownloaderDownloadResponse
    const dbStatus = getDbStatus(id)

    if (dbStatus === DbStatus.NO_INFORMATION) {
      addQueue({
        dbId: id,
      })

      result = {
        id,
        result: DbStatus[DbStatus.WAIT],
      }
    } else {
      result = {
        id,
        result: DbStatus[dbStatus],
      }
    }

    res.json(result)
  } catch (e) {
    next(e)
  }
})

export default router
