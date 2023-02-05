import dotenv from 'dotenv'
import app from './app'
import { startDownloaderManager, stopManager } from './downloader'
import fs from 'fs'
import http from 'http'

export default function allDownloaderApps(): {
  appInstance: http.Server
  stopManager: () => void
} {
  dotenv.config()
  const beeUrl = process.env.SWARM_DOWNLOADER_BEE_URL || 'http://localhost:1633'
  const outputPath = process.env.SWARM_DOWNLOADER_OUTPUT_PATH || './output'
  const sleepTime = Number(process.env.SWARM_DOWNLOADER_SLEEP_TIME) || 1000
  const port = process.env.SWARM_DOWNLOADER_PORT || 7891

  // eslint-disable-next-line no-console
  console.log(`SWARM_DOWNLOADER_OUTPUT_PATH: ${outputPath}`)
  // eslint-disable-next-line no-console
  console.log(`SWARM_DOWNLOADER_SLEEP_TIME: ${sleepTime}`)
  // eslint-disable-next-line no-console
  console.log(`SWARM_DOWNLOADER_PORT: ${port}`)

  if (!beeUrl) {
    throw new Error('Bee url should be defined')
  }

  if (!fs.existsSync(outputPath)) {
    throw new Error('The output path was not found')
  }

  if (sleepTime <= 0) {
    throw new Error('Sleep time should be positive number')
  }

  if (port <= 0) {
    throw new Error('The port should be positive number')
  }

  startDownloaderManager({
    beeUrl,
    outputPath,
    sleepTime,
  }).then()
  const appInstance = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Downloader server running on port ${port}`)
  })

  return {
    appInstance,
    stopManager,
  }
}
