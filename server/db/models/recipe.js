const Sequelize = require('sequelize')
const db = require('../db')

const Recipe = db.define('recipe', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  picture_url: {
    type: Sequelize.STRING
  },
  ingredients: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false
  },
  directions: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false
  }
})

module.exports = Recipe;