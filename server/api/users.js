const router = require('express').Router();
const {User} = require('../db/models');
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


// POST /api/users
router.post('/', (req, res, next) => {
  User.create(req.body)
  .then(user => res.json(user))
  .catch(next);
});


// GET /api/users/:userId
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findOne({
    where: {id},
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
  .then(res.json(req.body))
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
