const db = require('./server/db');
const Recipe = db.model('recipe');
const axios = require('axios');
const Promise = require('bluebird');
const getJsonFromUrl = require('./server/recipe-to-json');
require('./secrets'); //not for deployed use

const walkthrough = {
  title: 'Welcome to Tiny Kitchen',
  source_url: 'http://localhost:8080/',
  picture_url: '',
  ingredients: [],
  directions: ['Press play to get started...',
  'Welcome to Tiny Kichen, an intelligent cooking app featuring me, Mochi. I\'m an AI cooking assistant who can read recipe steps, set timers, and perform unit conversions based on voice commands.',
  'On the home page, you will find plenty of recipes to get you started, or you can add recipes from elsewhere on the web using the Tiny Kitchen Chrome Extension.',
  'From an individual recipe page, you will have the option to enter cooking mode. In fact, you\'re in cooking mode right now!',
  'Here, you will be able to speak with me, Mochi. If you would like me to read the recipe steps, simply hit the play button. You can also say: \'start cooking\', \'start\', \'stop\', or \'pause.\'',
  'You can also ask me unit conversion questions, like \'what is one pound in ounces\', or \'convert one tablespoon to teaspoons.\' You can also ask me to set a timer, for example, \'set a timer for 5 minutes.\'',
  'If you enjoy a particular recipe, you can add it to your recipe box once you exit cooking mode. You can also add notes to the recipe and add individual ingredients to your grocery list.',
  'To begin using cooking mode, grocery list, and other features, simply sign or create a new account. Happy cooking!'
  ]
}

const recipeLinks = [
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1016833-spaghetti-and-drop-meatballs-with-tomato-sauce?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=1', picture_url: 'https://static01.nyt.com/images/2015/09/25/dining/drop-meatballs/drop-meatballs-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1016841-rigatoni-and-cauliflower-al-forno?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=2', picture_url: 'https://static01.nyt.com/images/2014/10/01/dining/01KITCHEN3/01KITCHEN3-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/9558-takeout-style-sesame-noodles?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=3', picture_url: 'https://static01.nyt.com/images/2014/03/17/dining/takeoutnoodles/takeoutnoodles-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1015812-simplest-roast-chicken?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=6', picture_url: 'https://static01.nyt.com/images/2009/10/30/dining/video-roastedchicken/video-roastedchicken-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1016854-pasta-alla-norma-my-way?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=8', picture_url: 'https://static01.nyt.com/images/2014/10/08/dining/08BITTMAN/08BITTMAN-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1017304-cacio-e-pepe?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=9', picture_url: 'https://static01.nyt.com/images/2015/03/22/magazine/22eat4caciopepe/22eat4caciopepe-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1013121-pad-thai?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=10', picture_url: 'https://static01.nyt.com/images/2017/08/09/dining/09COOKING-PADTHAI1/09COOKING-PADTHAI1-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1017244-roasted-salmon-glazed-with-brown-sugar-and-mustard?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=12', picture_url: 'https://static01.nyt.com/images/2015/07/06/dining/06GLAZEDSALMON/06GLAZEDSALMON-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/5703-salmon-roasted-in-butter?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=14', picture_url: 'https://static01.nyt.com/images/2015/08/14/dining/14ROASTEDSALMON/14ROASTEDSALMON-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1016158-indian-spiced-tomato-and-egg-casserole?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=15', picture_url: 'https://static01.nyt.com/images/2014/03/26/dining/26CASSEROLE5/26JPCASSEROLE5-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1014832-pasta-alla-norma?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=16', picture_url: 'https://static01.nyt.com/images/2013/06/26/dining/26JPFLEX1/26JPFLEX1-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1016023-spicy-ginger-pork-noodles-with-bok-choy?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=17', picture_url: 'https://static01.nyt.com/images/2014/02/03/dining/dinner-porknoodles/dinner-porknoodles-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1016252-salmon-and-tomatoes-in-foil?action=click&module=Collection%20Page%20Recipe%20Card&region=Our%20Most%20Popular%20Weeknight%20Recipes%20of%202015&pgType=collection&rank=18', picture_url: 'https://static01.nyt.com/images/2014/05/27/dining/Salmon-and-Tomatoes/Salmon-and-Tomatoes-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1014647-sweet-potato-fries?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=2', picture_url: 'https://static01.nyt.com/images/2016/06/28/dining/28COOKING-SWEET-POTATO-FRIES1/28COOKING-SWEET-POTATO-FRIES1-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/7289-raw-beet-salad?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=3', picture_url: 'https://static01.nyt.com/images/2015/10/15/dining/15COOKING-BEETSALAD/15COOKING-BEETSALAD-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1015571-gratinee-of-cauliflower?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=4', picture_url: 'https://static01.nyt.com/images/2014/04/24/dining/Gratinee-of-Cauliflower/Gratinee-of-Cauliflower-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1015707-lemon-garlic-kale-salad?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=5', picture_url: 'https://static01.nyt.com/images/2016/03/07/dining/07COOKING-GARLICKALESALAD2/07COOKING-GARLICKALESALAD2-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1016924-double-apple-pie?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=6', picture_url: 'https://static01.nyt.com/images/2015/10/29/dining/29COOKING-APPLEPIE2/29COOKING-APPLEPIE2-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1013349-lemony-brussels-sprout-slaw?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=7', picture_url: 'https://static01.nyt.com/images/2016/04/18/dining/18COOKING-LEMONYBRUSSELSSPROUTSLAW/18COOKING-LEMONYBRUSSELSSPROUTSLAW-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1015410-creamy-potato-gratin?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=8', picture_url: 'https://static01.nyt.com/images/2015/11/20/dining/20COOKING-AUGRATINPOTATOES/20COOKING-AUGRATINPOTATOES-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1012878-caramelized-apple-pecan-cake?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=9', picture_url: 'https://static01.nyt.com/images/2014/04/17/dining/CaramelizedApplePecanCake/CaramelizedApplePecanCake-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1012645-beet-and-radicchio-salad-with-goat-cheese-and-pistachios?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=10', picture_url: 'https://static01.nyt.com/images/2016/02/03/dining/03COOKING-BEETSALAD/03COOKING-BEETSALAD-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1857-thomas-kellers-butternut-squash-soup-with-brown-butter?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=11', picture_url: 'https://static01.nyt.com/images/2014/05/23/dining/SquashSoup/SquashSoup-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/7588-roasted-cauliflower?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=12', picture_url: 'https://static01.nyt.com/images/2015/10/15/dining/15COOKING-CAULIFLOWER1/15COOKING-CAULIFLOWER-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1017703-roasted-vegetables?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=14', picture_url: 'https://static01.nyt.com/images/2015/09/23/dining/23ROASTEDVEGETABLES/23ROASTEDVEGETABLES-articleLarge.jpg'},
  {type: 'link', web_url: 'https://cooking.nytimes.com/recipes/1018032-caramelized-citrus?action=click&module=Collection%20Page%20Recipe%20Card&region=Not%20Really%20Seasonal%2C%20But%20We%20Can%27t%20Stop%20Eating%20Them%20Anyway&pgType=collection&rank=15', picture_url: 'https://static01.nyt.com/images/2016/03/20/magazine/20eat1/20mag-20eat-t_CA1-articleLarge.jpg'}
]

function getRecipes(){
  return axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.NYT_KEY}&query=recipe`)
  .then(apiRes => {
    const recipes = apiRes.data.response.docs.concat(recipeLinks);

    const promises = [];
    recipes.forEach(recipe => {
      let promise = recipe.type === 'link' ? getJsonFromUrl(recipe.web_url, recipe.picture_url) : getJsonFromUrl(recipe.web_url, 'https://nytimes.com/' + recipe.multimedia[1].url);
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
    promises.unshift(Recipe.build(walkthrough));
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