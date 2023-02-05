import express from 'express'
import dotenv from 'dotenv'
import { errorHandler, swarmHashMiddleware } from '../server/app'
import { VERSION } from '../shared/const'
import downloadRouter from './routes/download'
import statusRouter from './routes/status'

dotenv.config()

const app = express()
app.use(express.json())
app.use(swarmHashMiddleware)
app.use(`/v${VERSION}/download`, downloadRouter)
app.use(`/v${VERSION}/status`, statusRouter)
app.use(errorHandler)

export default app
