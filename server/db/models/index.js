const User = require('./user');
const Recipe = require('./recipe');
const RecipeBox = require('./recipe_box');


Recipe.belongsToMany(User, {through: RecipeBox});
User.belongsToMany(Recipe, {through: RecipeBox});

User.belongsToMany(User, {as: 'follower', through: 'follows'}); //creates friends join table


module.exports = {
  User,
  Recipe,
  RecipeBox
}
