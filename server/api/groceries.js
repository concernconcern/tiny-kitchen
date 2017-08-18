const router = require('express').Router();
const db = require('../db/db');
const Grocery = db.model('grocery');
const GroceryUser = db.model('groceryUser');
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
  console.log('title: ', title)
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
    // if (!created){
    //   console.log('groceryuser: ', groceryUser)
    //   groceryUser.addQuantity(quantity, unit)
    // }
    res.json(addedGrocery);
  })
  .catch(next);
});

// DELETE
router.delete('/:userId/:groceryId', (req, res, next) => {
  const userId = req.params.userId;
  const groceryId = req.params.groceryId;
  GroceryUser.findOne({
    where: {userId, groceryId}
  })
  .then(groceryUser => groceryUser.destroy())
  .then(res.send(groceryId + ' grocery deleted from list'))
  .catch(next);
});
