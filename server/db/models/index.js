const User = require('./user');
const Recipe = require('./recipe');
const RecipeBox = require('./recipe_box');

/*
JB:
This is where we should use a many-to-many association to associate users with recipes through the Recipe Box.
By declaring Recipe.belongsToMany(User, {through: RecipeBox}) and User.belongsToMany(Recipe, {through: RecipeBox}), this will
tell Sequelize to use RecipeBox as the association table between the two models.
*/

// Recipe.belongsTo(RecipeBox)
RecipeBox.belongsTo(Recipe);
RecipeBox.belongsTo(User);

User.belongsToMany(User, { as: 'follower', through: 'follows' }); //creates friends join table


module.exports = {
  User,
  Recipe,
  RecipeBox
}
