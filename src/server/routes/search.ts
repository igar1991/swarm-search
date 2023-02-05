import express from 'express'
// import { validateDbId, validateSearchParams } from '../utils/validator'
// import { search } from '../../search/search'

const router = express.Router()

router.get('/', (req, res) => {
  const { id } = req.query
  // if (!validateDbId(id)) {
  //   res.status(400).json({ error: 'Invalid db id' })
  //   return
  // }
  //
  // if (!validateSearchParams(req.query)) {
  //   res.status(400).json({ error: 'Invalid search parameters' })
  //   return
  // }
  //
  // const results = search(id, req.query)
  res.json({ id, result: 'kkkk' })
})

export default router
