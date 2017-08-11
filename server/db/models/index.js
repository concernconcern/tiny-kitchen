const User = require('./user');
const Recipe = require('./recipe');
const RecipeBox = require('./recipe_box');

// Recipe.belongsTo(RecipeBox)
RecipeBox.belongsTo(Recipe);
RecipeBox.belongsTo(User);

User.belongsToMany(User, {as: 'follower', through: 'follows'}); //creates friends join table


module.exports = {
  User,
  Recipe,
  RecipeBox
}
