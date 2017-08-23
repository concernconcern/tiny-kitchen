const router = require('express').Router();
const db = require('../db/db');
const Grocery = db.model('grocery');
const User = db.model('user');
const Promise = require('bluebird');
module.exports = router;

//get groceries from a user
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  Grocery.findAll({
    where: {userId: id}
  })
  .then(groceries => res.json(groceries))
  .catch(next);
});

// POST
router.post('/:userId', (req, res, next) => {
  return Grocery.create(req.body)
  .then((grocery) => res.json(grocery))
  .catch(next);
})

//returns all groceries from a user regardless
router.post('/:userId/bulk', (req, res, next) => {
  const id = req.params.userId;
  return Grocery.bulkCreate(req.body)
  .then(Grocery.findAll({
      where: {
        userId: id
      }
    }))
  .then(groceries => {
    console.log('groceries api back from bulk add: ', groceries)
    res.json(groceries)
  })
  .catch(next);
})

router.put('/:userId/bulk', (req, res, next) => {
  let editedGroceries = req.body;
  console.log('editedGroceries in api route', editedGroceries)
  Promise.map(editedGroceries, grocery => {
    console.log('groceryItem: ', grocery)
    return Grocery.findById(grocery.editedId)
    .then(oldGrocery => oldGrocery.update({title: grocery.content}))
  })
  .then(updatedGroceries => res.json(updatedGroceries))
})

router.put('/:groceryId', (req, res, next) =>
    Grocery.findById(req.params.groceryId)
    .then(grocery => grocery.update(req.body))
    .then((grocery) => res.json(grocery))
    .catch(next)
  )


// DELETE
router.delete('/:groceryId', (req, res, next) =>
  Grocery.findById(req.params.groceryId)
  .then((grocery) => grocery.destroy())
  .then(res.send(req.params.groceryId + ' grocery deleted from list'))
  .catch(next))
// router.post('/:userId/bulk', (req, res, next) => {

//   const userId = req.params.userId;
//   Grocery.bulkCreate(req.body)
//   .then(() => {
//     return Grocery.update({

//     })
//   })
//   User.findById(userId)
//   .then(user => {
//     return user.getGroceries()
//   })
//   .then(groceries => {
//     let promises = groceries.map(grocery => {
//       return grocery.update({title: 'foo'})
//     })
//     return Promise.all(promises)
//   })
//   .then(results => {
//     console.log('results', results);
//   })
// })


