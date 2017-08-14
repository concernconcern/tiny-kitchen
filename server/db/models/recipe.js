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
  picture_url: {
    type: Sequelize.STRING
  },
  ingredients: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: false
  },
  directions: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: false
  },
  rating: {
    type: Sequelize.FLOAT(1,1),
    defaultValue: 0,
    validate: {
      min: 0.0,
      max: 5.0
    }
  }
})

module.exports = Recipe;
