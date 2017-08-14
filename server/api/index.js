const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/recipes', require('./recipes'));
router.use('/recipeboxes', require('./recipeboxes'));
router.use('/followers', require('./followers'));
router.use('/recipe-sources', require('./recipe-sources'))

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
