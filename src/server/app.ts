import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Request, Response, NextFunction } from 'express'
import infoRouter from './routes/info'
import indexRouter from './routes/index'
import searchRouter from './routes/search'
import suggestRouter from './routes/suggest'
import { isSwarmReference } from '../shared/utils/swarm'
import { VERSION } from '../shared/const'
import { fillConfig, printConfig } from '../shared/utils/config'
import { checkConfig, explainConfig } from './utils/config'
import { loadDbs } from './utils/dbs'
import { storeServerConfig } from './utils/info'

export function reloadConfig(): void {
  dotenv.config()
  const serverConfig = fillConfig()
  printConfig(serverConfig, explainConfig)
  checkConfig(serverConfig)
  loadDbs(serverConfig)
  storeServerConfig(serverConfig)
}

/**
 * Swarm hash of "id" validator
 */
export const swarmHashMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === '/v1/info') {
    next()

    return
  }

  const id = req.method === 'POST' ? req.body.id : req.query.id

  if (!id) {
    return res.status(400).send({ error: 'Missing "id" parameter' })
  }

  if (!isSwarmReference(id.toString())) {
    return res.status(400).send({ error: 'Invalid "id" format' })
  }
  next()
}

export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error = {
    status: 'error',
    message: err.message,
  }

  res.status(500).json(error)
}

const app = express()
app.use(cors())
app.use(express.json())
app.use(swarmHashMiddleware)
app.use(`/v${VERSION}/info`, infoRouter)
app.use(`/v${VERSION}/index`, indexRouter)
app.use(`/v${VERSION}/search`, searchRouter)
app.use(`/v${VERSION}/suggest`, suggestRouter)
// eslint-disable-next-line unused-imports/no-unused-vars
app.use(errorHandler)

export default app
