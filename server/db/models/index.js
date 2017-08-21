const User = require('./user');
const Recipe = require('./recipe');
const RecipeBox = require('./recipe_box');

Recipe.belongsToMany(User, {through: RecipeBox});
User.belongsToMany(Recipe, {through: RecipeBox});

module.exports = {
  User,
  Recipe,
  RecipeBox
}
