const router = require('express').Router();
const db = require('../db/db');
const User = db.model('user');
const RecipeBox = db.model('recipebox');
const Recipe = db.model('recipe');
const Promise = require('bluebird')
module.exports = router;

// GET /api/users
router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next);
});



// POST /api/users (create user, just for testing purposes rn)
router.post('/', (req, res, next) => {
  User.create(req.body)
    .then(user => res.json(user))
    .catch(next);
});


// GET /api/users/:userId (get single user)
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findOne({
    where: { id },
    attributes: ['id', 'email', 'firstName', 'lastName', 'picture_url']
  })
    .then(user => res.json(user))
    .catch(next);
});


// PUT /api/users/:userId
router.put('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => user.update(req.body))
    .then(user => res.json(user))
    .catch(next);
});

// DELETE /api/users/:userId
router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => user.destroy())
    .then(res.send('User destroyed'))
    .catch(next);
});

/* RECIPE BOX */

// GET /api/users/:userId/recipebox (get user's recipes)
router.get('/:userId/recipebox', (req, res, next) => {
  const id = req.params.userId;
  RecipeBox.findAll({
    where: { userId: id }
  })
    .then(recipeBoxes =>
      Promise.map(recipeBoxes, box => {
        return Recipe.findById(box.recipeId)
      }))
    .then(userRecipes => res.json(userRecipes))
    .catch(next);
});

// GET /api/users/:userId/recipebox/:recipeId (get a single recipe's recipebox)
router.get('/:userId/recipebox/:recipeId', (req, res, next) => {
  const userId = req.params.userId;
  const recipeId = req.params.recipeId;
  RecipeBox.findOne({
    where: {
      userId,
      recipeId
    }
  }).then(recipeBox => res.json(recipeBox))
    .catch(next);
});


// POST /api/users/:userId/recipebox (post a recipe to user's recipe box)
router.post('/:userId/recipebox/', (req, res, next) => {
  const userId = req.params.userId;
  req.body.userId = userId;
  RecipeBox.create(req.body)
    .then(recipe => res.json(recipe))
    .catch(next);
});

// DELETE /api/users/:userId/recipebox/:recipeId (delete a recipe from user recipe box)
router.delete('/:userId/recipebox/:recipeId', (req, res, next) => {
  const userId = req.params.userId;
  const recipeId = req.params.recipeId;
  RecipeBox.findOne({
    where: { userId, recipeId }
  })
    .then(recipe => recipe.destroy())
    .then(res.send(recipeId + ' recipe was destroyed'))
    .catch(next);
});


// PUT /api/users/:userId/recipebox/:recipeId (edit a recipe in user recipe box)
router.put('/:userId/recipebox/:recipeId', (req, res, next) => {
  const userId = req.params.userId;
  const recipeId = req.params.recipeId;
  RecipeBox.findOne({
    where: { userId, recipeId }
  })
    .then(recipe => recipe.update(req.body))
    .then(recipe => res.send(recipe))
    .catch(next);
});



