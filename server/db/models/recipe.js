const Sequelize = require('sequelize')
const db = require('../db')


const Recipe = db.define('recipe', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  source_url: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true
  },
  picture_url: {
    type: Sequelize.TEXT
  },
  ingredients: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: false
  },
  directions: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: false
  }
})

module.exports = Recipe;
