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
  Follower.create(req.body)
  .then(follower => res.json(follower))
  .catch(next);
});


// GET /api/followers/:userId (fetch who follows a user)
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  Follower.findAll({
    where: {userId: id},
    attributes: ['id']
  })
  .then(followers => res.json(followers))
  .catch(next);
});

// GET /api/followers/follow/:userId (fetch who a user follows)
router.get('/follow/:userId', (req, res, next) => {
  const id = req.params.userId;
  Follower.findAll({
    where: {followerId: id},
    attributes: ['id']
  })
  .then(followees => res.json(followees))
  .catch(next);
});

// DELETE /api/follower/:userId/:followId (Unfollow someone!)
router.delete('/:userId/:followId', (req, res, next) => {
  const followerId = req.params.userId;
  const userId = req.params.followId; //who you are following
  Follower.findOne({
    where: {userId, followerId}
  })
  .then(follow => follow.destroy())
  .then(res.send('Unfollowed ' + userId))
  .catch(next);
});
