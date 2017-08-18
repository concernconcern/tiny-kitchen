const Sequelize = require('sequelize')
const db = require('../db')

const Grocery = db.define('grocery', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  quantity: {
    type: Sequelize.FLOAT
  }
})
