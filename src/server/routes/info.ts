import express from 'express'
import { getStoredServerInfo } from '../utils/info'

const router = express.Router()

router.get('/', (req, res) => {
  res.json(getStoredServerInfo())
})

export default router
