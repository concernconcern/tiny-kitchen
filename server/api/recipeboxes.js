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
router.post('/', (req, res, next) => {
  RecipeBox.create(req.body)
  .then(recipe => res.json(recipe))
  .catch(next);
});

// GET /api/recipeboxes/:recipeId
router.get('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  RecipeBox.findOne({
    where: {id},
    attributes: ['id', 'email', 'firstName', 'lastName', 'picture_url']
  })
  .then(recipe => res.json(recipe))
  .catch(next);
});

// PUT /api/recipeboxes/:recipeId
router.put('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  RecipeBox.findById(id)
  .then(recipe => recipe.update(req.body))
  .catch(next);
});

// DELETE /api/recipeboxes/:recipeId
router.delete('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  RecipeBox.findById(id)
  .then(recipe => recipe.destroy())
  .catch(next);
});
