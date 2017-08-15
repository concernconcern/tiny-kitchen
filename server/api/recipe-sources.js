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

router.get('/nytimes', (req, res, next) => {
  console.log('new york times');
  axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.NYT_KEY}&query=recipe`)
    .then(apiRes => {
      const recipes = apiRes.data.response.docs;

      const promises = [];
      recipes.forEach(recipe => {
        let promise = getJsonFromUrl(recipe.web_url, 'https://nytimes.com/' + recipe.multimedia[1].url);
        promises.push(promise)
      })

      Promise.all(promises)
        .then(data => {
          res.send(data);
        })
    })
    .catch(err => {
      res.send(err);
    })
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
