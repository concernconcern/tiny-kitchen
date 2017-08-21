const Sequelize = require('sequelize')
const db = require('../db')

const RecipeBox = db.define('recipebox', {
  notes: {
    type: Sequelize.TEXT
  },
  picture_urls: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
})

module.exports = RecipeBox;
