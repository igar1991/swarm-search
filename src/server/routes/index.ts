import express from 'express'
import { IndexStatusResponse } from '../../shared/response/interfaces'
import { DbStatus } from '../../downloader/downloader'
import { IdQuery } from '../interfaces'
import axios from 'axios'
import { getServerConfig } from '../utils/info'
import { DownloaderDownloadResponse, DownloaderStatusResponse } from '../../downloader/interfaces'
import { assertDbUsingAllowed } from '../utils/dbs'

const router = express.Router()
router.post('/use', async (req, res, next) => {
  const downloaderServerUrl = getServerConfig().downloaderServerUrl
  try {
    const { id } = req.body

    assertDbUsingAllowed(getServerConfig(), id)
    let status = DbStatus[DbStatus.ERROR]
    let message = ''
    try {
      const data = (await axios.post(`${downloaderServerUrl}/download`, { id })).data as DownloaderDownloadResponse
      status = data.result
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = `Error on sending task to downloader: ${e.message}`
    }

    const result: IndexStatusResponse = {
      id,
      status,
      message,
    }

    res.json(result)
  } catch (e) {
    next(e)
  }
})

router.get('/status', async (req, res, next) => {
  const downloaderServerUrl = getServerConfig().downloaderServerUrl
  try {
    const { id } = req.query as unknown as IdQuery

    assertDbUsingAllowed(getServerConfig(), id)
    let status = DbStatus[DbStatus.ERROR]
    let message = ''
    try {
      const data = (await axios.get(`${downloaderServerUrl}/status`, { params: { id } }))
        .data as DownloaderStatusResponse
      status = data.result
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = `Error on getting status from downloader: ${e.message}`
    }
    const result: IndexStatusResponse = {
      id,
      status,
      message,
    }
    res.json(result)
  } catch (e) {
    next(e)
  }
})

export default router
