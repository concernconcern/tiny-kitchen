const User = require('./user')
const Recipe = require('./recipe')
const RecipeBox = require('./recipe_box')

// Recipe.belongsTo(RecipeBox)
// RecipeBox.belongsTo(Recipe)

module.exports = {
  User,
  Recipe,
  RecipeBox
}