const Sequelize = require('sequelize')
const db = require('../db')

const GroceryUser = db.define('groceryUser', {
  quantity: {
    type: Sequelize.FLOAT
  },
})

module.exports = GroceryUser
