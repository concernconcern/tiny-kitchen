const router = require('express').Router();
const db = require('../db/db');
const Follower = db.model('follows');
module.exports = router;

// GET /api/followers (get entire followers table)
router.get('/', (req, res, next) => {
  Follower.findAll()
    .then(followers => res.json(followers))
    .catch(next);
});

// POST /api/followers/
router.post('/', (req, res, next) => {
  Follower.findOrCreate(req.body)
  .then(follower => res.json(follower))
  .catch(next);
});


// GET /api/followers/:userId (fetch who follows a user)
router.get('/:recipeId', (req, res, next) => {
  const id = req.params.userId;
  Follower.findAll({
    where: {id},
    attributes: ['id', 'email', 'firstName', 'lastName', 'picture_url']
  })
  .then(followers => res.json(followers))
  .catch(next);
});

// GET /api/followers/follow/:userId (fetch who a user follows)
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  Follower.findAll({
    where: {followerId: id},
    attributes: ['id', 'email', 'firstName', 'lastName', 'picture_url']
  })
  .then(followees => res.json(followees))
  .catch(next);
});

// DELETE /api/friends/:userId/:friendId
router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  const friendId = req.params.friendId;
  Follower.findOne({
    where: {id, friendId}
  })
  .then(friend => friend.destroy())
  .catch(next);

  Follower.findOne({
    where: {id: friendId, friendId: id}
  })
  .then(friend => friend.destroy())
  .catch(next);
});
