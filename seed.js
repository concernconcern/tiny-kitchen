const db = require('./server/db');
const Recipe = db.model('recipes');
const axios = require('axios');

function buildRecipes(){
  return axios.get(`/api/recipe-sources/nytimes`)
  .then(res => {
    let promises = [];
    const recipes = res.data;
    recipes.forEach(recipe => {
      promises.push(Recipe.build(recipe));
    })
    return promises;
  })
}


function saveRecipes(){
  return Promise.map(buildRecipes(), function(recipe) {
    return recipe.save();
  });
}

function seed() {
  let arr = [buildRecipes()];
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