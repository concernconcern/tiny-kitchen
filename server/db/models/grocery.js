const Sequelize = require('sequelize')
const db = require('../db')

const Grocery = db.define('grocery', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
})

module.exports = Grocery;

