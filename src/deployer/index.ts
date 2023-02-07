import dotenv from 'dotenv'
import axios from 'axios'
import path from 'path'
import { IndexStatusResponse } from '../shared/response/interfaces'
import { DbStatus } from '../downloader/downloader'
import { sleep } from '../shared/utils'

dotenv.config()

async function start() {
  const dbId = process.env.SWARM_DEPLOYER_DB_ID
  const deployUrl = process.env.SWARM_DEPLOYER_SERVER_URL

  // eslint-disable-next-line no-console
  console.log(`SWARM_DEPLOYER_DB_ID: ${dbId}`)
  // eslint-disable-next-line no-console
  console.log(`SWARM_DEPLOYER_SERVER_URL: ${deployUrl}`)

  if (!dbId) {
    throw new Error('SWARM_DEPLOYER_DB_ID is empty')
  }

  if (!deployUrl) {
    throw new Error('SWARM_DEPLOYER_SERVER_URL is empty')
  }

  const indexUseUrl = path.join(deployUrl, 'index/use')
  const indexStatusUrl = path.join(deployUrl, 'index/status')
  const useResponse = (
    await axios.post(indexUseUrl, {
      id: dbId,
    })
  ).data as IndexStatusResponse
  // eslint-disable-next-line no-console
  console.log(`Use status: ${JSON.stringify(useResponse)}`)

  if (useResponse.status === DbStatus[DbStatus.WAIT] || useResponse.status === DbStatus[DbStatus.DOWNLOADING]) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const statusResponse = (
        await axios.get(indexStatusUrl, {
          params: {
            id: dbId,
          },
        })
      ).data as IndexStatusResponse
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(statusResponse))

      if (statusResponse.status === DbStatus[DbStatus.DONE]) {
        // eslint-disable-next-line no-console
        console.log('Downloading done!')
        break
      }

      if (statusResponse.status === DbStatus[DbStatus.ERROR]) {
        // eslint-disable-next-line no-console
        console.log('Downloading error!')
        break
      }

      await sleep(1000)
    }
  } else if (useResponse.status === DbStatus[DbStatus.DONE]) {
    // eslint-disable-next-line no-console
    console.log('Downloading already done!')
  } else {
    throw new Error(`Deploy error: ${JSON.stringify(useResponse)}`)
  }
}

start().then()
