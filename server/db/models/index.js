const User = require('./user');
const Recipe = require('./recipe');
const RecipeBox = require('./recipe_box');
const Grocery = require('./grocery')


Recipe.belongsToMany(User, { through: RecipeBox });
User.belongsToMany(Recipe, { through: RecipeBox });

User.hasMany(Grocery);
Grocery.belongsTo(User);

module.exports = {
  User,
  Recipe,
  RecipeBox,
  Grocery,
}
