const Sequelize = require('sequelize')
const db = require('../db')

const Recipe = db.define('recipe', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  source_url: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  default_picture_url: {
    type: Sequelize.STRING
  },
  picture_urls: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  ingredients: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false
  },
  directions: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false
  },
  rating: {
    type: Sequelize.FLOAT(11, 11),
    defaultValue: 0,
    validate: {
      min: 0.0,
      max: 5.0
    }
  }
})

module.exports = Recipe;
