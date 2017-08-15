const db = require('./server/db');
const Recipe = db.model('recipe');
const User = db.model('user');
const RecipeBox = db.model('recipebox');
const axios = require('axios');
const Promise = require('bluebird');
const getJsonFromUrl = require('./server/recipe-to-json');
const chance = require('chance')(123);
require('./secrets');

function doTimes (n, fn) {
  var results = [];
  while (n--) {
    results.push(fn(n));
  }
  return results;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

let foodImg = [
'http://www.mccain.com/SiteCollectionImages/McCainCorporate/goodfood-products/McCain-Smiles-N-America.png',
'http://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/2/22/0/BX0110H_orange-baked-ham_s4x3.jpg.rend.hgtvcom.966.725.suffix/1371606081476.jpeg',
'https://cdn.pixabay.com/photo/2015/04/10/00/41/food-715539_960_720.jpg',
'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheese_crust_pizza.jpg/1200px-Cheese_crust_pizza.jpg',
'https://media2.s-nbcnews.com/j/newscms/2017_10/1200234/10-healthy-fast-food-meals-008-subway-inline-today-170309_89a32509f1b93e969a831a913cc2a2d1.today-inline-large.jpg',
'https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_960_720.jpg',
'http://www.smithfieldfoods.com/images/home/packaged-brands/armour-food.jpg',
'https://eat24hours.com/files/cuisines/v4/thai.jpg?e24v=103?e24v=178?e24v=178',
'https://static.pexels.com/photos/70497/pexels-photo-70497.jpeg'];

// RECIPES
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

// USERS
let emails = chance.unique(chance.email, 100);

function randUser () {
  let address = chance.address();
  return User.build({
    first_name: chance.first(),
    last_name: chance.last(),
    email: emails.pop(),
    password: chance.word(),
    picture_url: "https://maxcdn.icons8.com/Share/icon/Users//circled_user_female1600.png",
    is_admin: chance.weighted([true, false], [5, 95]),
  });
}

function generateUsers(){
  let users = doTimes(100, randUser);
  users.push(User.build({
    first_name: 'Sarah',
    last_name: 'Charles',
    email: 'sarah@sarha.com',
    password: 'gus',
    is_admin: true,
    picture_url: 'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/20768023_10207797720139613_1847547037954003603_n.jpg?oh=2d3912b2d890d2129bbbeed2460edea9&oe=59F07A99'
  }));
  users.push(User.build({
    first_name: 'Danni',
    last_name: 'Liu',
    email: 'danni@liu.liu',
    password: 'liu',
    is_admin: true,
    picture_url: 'https://maxcdn.icons8.com/Share/icon/Users//circled_user_female1600.png'
  }));
  return users;
}

function createUsers(){
  return Promise.map(generateUsers(), function(user) {
    return user.save();
  });
}

// RECIPE BOXES

function randRB(n){

}

function generateRecipeBoxes(){
  let recipeBoxes = doTimes(100, randRB);
  return recipeBoxes;
}

function createRecipeBoxes(){
  Promise.map(generateRecipeBoxes(), function(rb){
    return rb.save();
  })
}


// SEED
function seed() {
  let arr = [saveRecipes(), createUsers(), createRecipeBoxes()];
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
