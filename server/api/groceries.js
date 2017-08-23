const router = require('express').Router();
const db = require('../db/db');
const Grocery = db.model('grocery');
const User = db.model('user');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
require('../../secrets');
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
    res.json(groceries)
  })
  .catch(next);
})

router.put('/:userId/bulk', (req, res, next) => {
  let editedGroceries = req.body;
  Promise.map(editedGroceries, grocery => {
    return Grocery.findById(grocery.editedId)
    .then(oldGrocery => oldGrocery.update({title: grocery.content}))
  })
  .then(updatedGroceries => res.json(updatedGroceries))
})

// POST
router.post('/:userId/email', (req, res, next) => {
  // create reusable transporter object using the default SMTP transport
  const { user, userGroceries } = req.body;
  let buildEmail = function (groceries) {
    let message = '<h3>Your groceries:</h3><ul>';
    groceries.forEach(grocery => {
      message = message.concat(`<li>${grocery.title}</li>`)
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
    res.json(transporter.sendMail);
  });
});

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

