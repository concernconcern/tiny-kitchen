const router = require('express').Router();
const db = require('../db/db');
const Recipe = db.model('recipe');
const RecipeBox = db.model('recipebox');
module.exports = router;

// GET /api/recipes
router.get('/', (req, res, next) => {
  Recipe.findAll()
    .then(recipes => res.json(recipes))
    .catch(next);
});

// POST /api/recipes
router.post('/', (req, res, next) => {
  Recipe.create(req.body)
    .then(recipe => res.json(recipe))
    .catch(next);
});

// GET /api/recipes? by search string
router.get('/search', (req, res, next) => {
  const search = req.query.search;
  Recipe.findAll({where: {
    $or: [
      {title: {like: '%' + search + '%'}}
    ]
  }})
    .then(recipes => res.json(recipes))
    .catch(next);
});

// GET /api/recipes/batch
router.get('/batch/:offset', (req, res, next) => {
  const offset = req.params.offset;
  Recipe.findAll({ offset: offset * 12, limit: 12 })
    .then(recipes => res.json(recipes))
    .catch(next);
});

// GET /api/recipes/:recipeId
router.get('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  Recipe.findOne({
    where: { id }
  })
    .then(recipe => res.json(recipe))
    .catch(next);
});

// PUT /api/recipes/:recipeId
router.put('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  Recipe.findById(id)
    .then(recipe => recipe.update(req.body))
    .then(() => res.json(req.body))
    .catch(next);
});

// DELETE /api/recipes/:recipeId
router.delete('/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;
  Recipe.findById(id)
    .then(recipe => recipe.destroy())
    .then(res.send('Recipe destroyed'))
    .catch(next);
});

/* RECIPE BOX */
// GET /api/recipes/:recipeId/recipebox (get users that have put recipe in their recipeBox)
router.get('/:recipeId/recipebox', (req, res, next) => {
  const recipeId = req.params.recipeId;
  RecipeBox.findAll({
    where: {recipeId}
  })
  .then(users => res.json(users))
  .catch(next);
});
