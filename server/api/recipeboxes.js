const router = require('express').Router();
const {RecipeBox} = require('../db/models');
module.exports = router;

// GET /api/recipeboxes
router.get('/', (req, res, next) => {
  RecipeBox.findAll()
    .then(recipes => res.json(recipes))
    .catch(next);
});

// POST /api/recipeboxes
// JB: potentially change this to use Sequelize association method to associate user instance with a recipe instance
router.post('/', (req, res, next) => {
  RecipeBox.create(req.body)
  .then(recipe => res.json(recipe))
  .catch(next);
});

//GET single recipe
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  RecipeBox.findAll({
    where: {id},
    attributes: ['userId']
  })
  .then(recipe => res.json(recipe))
  .catch(next);
});

// GET /api/recipeboxes/:recipeId
//get all users with this recipe in recipe box
router.get('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  RecipeBox.findAll({
    where: {recipeId: id},
    attributes: ['userId']
  })
  .then(recipe => res.json(recipe))
  .catch(next);
});

// GET /api/recipeboxes/:userId
//get all recipes in a user'srecipe box
router.get('/:userId', (req, res, next) => {
  const id = req.params.recipeId;
  RecipeBox.findAll({
    where: {userId: id},
    attributes: ['recipeId']
  })
  .then(recipe => res.json(recipe))
  .catch(next);
});


// PUT /api/recipeboxes/:recipeId
router.put('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  RecipeBox.findById(id)
  .then(recipe => recipe.update(req.body))
  .then(res.json(req.body))
  .catch(next);
});

// DELETE /api/recipeboxes/:recipeId
router.delete('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  RecipeBox.findById(id)
  .then(recipe => recipe.destroy())
  .then(res.send('RecipeBox entry destroyed'))
  .catch(next);
});
