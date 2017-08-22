const router = require('express').Router();
const db = require('../db/db');
const Grocery = db.model('grocery');
const GroceryUser = db.model('groceryUser');
const User = db.model('user');
const Promise = require('bluebird');
module.exports = router;

//get groceries from a user
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  GroceryUser.findAll({
    where: {userId: id}
  })
  .then(groceryusers =>
    Promise.map(groceryusers, groceryuser => {
      return Grocery.findById(groceryuser.groceryId)
    }))
  .then(userGroceries => res.json(userGroceries))
  .catch(next);
});

// POST
router.post('/:userId', (req, res, next) => {
  const {title, quantity, unit} = req.body;
  const userId = req.params.userId;
  let addedGrocery;
  Grocery.findOrCreate({where: {
    title: title
  }})
  .spread((grocery, created) => {
    addedGrocery = grocery;
    return GroceryUser.findOrCreate({where: {
      groceryId: grocery.id,
      userId: userId
    }})
  })
  .spread((groceryUser, created) => {
    res.json(addedGrocery);
  })
  .catch(next);
});

router.put('/:userId/list', (req, res, next) => {
  let {updatedGroceries} = req.body;

  const userId = req.params.userId;
  User.findById(userId)
  .then(user => {
    return user.getGroceries()
  })
  .then(groceries => {
    groceries = groceries.map(grocery => {
      let updatedGrocery = updatedGroceries.find(g => g.id === grocery.id);
      if (updatedGrocery) grocery.newTitle = updatedGrocery.title;
      return grocery;
    }).filter(g => !!g.newTitle);

    let promises = groceries.map(grocery => {
      return grocery.update({title: grocery.newTitle})
    })

    return Promise.all(promises);
  })
  .then(results => {
    res.send(results);
  })
})

// DELETE
router.delete('/:userId/:groceryId', (req, res, next) => {
  console.log('delete')
  const userId = req.params.userId;
  const groceryId = req.params.groceryId;
  GroceryUser.findOne({
    where: {userId, groceryId}
  })
  .then(groceryUser => groceryUser.destroy())
  .then(destroyed => {res.send(groceryId)})
  .catch(next);
});
