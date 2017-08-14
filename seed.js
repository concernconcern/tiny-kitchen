const db = require('./server/db');
const Recipe = db.model('recipe');
const axios = require('axios');
const Promise = require('bluebird');
const getJsonFromUrl = require('./server/recipe-to-json');
require('./secrets');

function getRecipes(){
  return axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.NYT_KEY}&query=recipe`)
  .then(apiRes => {
    const recipes = apiRes.data.response.docs;

    const promises = [];
    recipes.forEach(recipe => {
      let promise = getJsonFromUrl(recipe.web_url, 'https://nytimes.com/' + recipe.multimedia[1].url);
      promises.push(promise)
    })

    return Promise.all(promises)
    .then(data => {
      return data;
    })
  })
}

function buildRecipes(){
  return getRecipes()
  .then(recipesData => {
    let promises = [];
    recipesData.forEach(recipe => {
      promises.push(Recipe.build(recipe));
    });
    return promises;
  })
}

function saveRecipes(){
  return Promise.map(buildRecipes(), function(recipe) {
    return recipe.save();
  });
}

function seed() {
  let arr = [saveRecipes()];
  return Promise.all(arr);
}

console.log('Syncing database');

db.sync({force: true})
.then(() => {
  console.log('Seeding database');
  return seed();
})
.then(function () {
  console.log('Seeding successful');
}, function (err) {
  console.error('Error while seeding');
  console.error(err.stack);
})
.finally(function () {
  db.close();
  return null;
});