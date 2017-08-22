const router = require('express').Router();
const db = require('../db/db');
const Grocery = db.model('grocery');
const GroceryUser = db.model('groceryUser');
const User = db.model('user');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
require('../../secrets');
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

// POST
router.post('/:userId/email', (req, res, next) => {
  // create reusable transporter object using the default SMTP transport
  const {user, userGroceries} = req.body;
  let buildEmail = function(groceries){
    let message = '<h3>Your groceries:</h3><ul>';
    groceries.forEach(grocery => {
      message = message.concat(`<li>${grocery}</li>`)
    })
    message = message.concat('</ul>')
    return message;
  }

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: process.env.TK_GMAIL_ADDRESS,
        pass: process.env.TK_GMAIL_PASSWORD
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: `"Tiny Kitchen" <${process.env.TK_GMAIL_ADDRESS}>`, // sender address
    to: user.email, // list of receivers
    subject: 'Your Grocery List', // Subject line
    text: buildEmail(userGroceries), // plain text body
    html: buildEmail(userGroceries) // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.json(transporter.sendMail);
  });
});

router.post('/:userId/list', (req, res, next) => {
  const {groceryList} = req.body;
  const userId = req.params.userId;
  User.findById(userId)
  .then(user => {
    return user.getGroceries()
  })
  .then(groceries => {
    let promises = groceries.map(grocery => {
      return grocery.update({title: 'foo'})
    })
    return Promise.all(promises)
  })
  .then(results => {
    console.log('results', results);
  })
})

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