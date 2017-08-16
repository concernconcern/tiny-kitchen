const router = require('express').Router()
const axios = require('axios')
const getJsonFromUrl = require('../recipe-to-json');
module.exports = router

router.use('/recipe-sources', require('./recipe-sources'))

router.post('/', (req, res, next) => {
  const url = req.body.url;
  console.log(url)
  getJsonFromUrl(url)
    .then(recipe => {
      res.send(recipe);
    })
})

// TEST ROUTE
router.get('/test', (req, res, next) => {
  const url = req.query.url;
  console.log(url)
  getJsonFromUrl(url)
    .then(recipe => {
      res.json(recipe);
    })
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
