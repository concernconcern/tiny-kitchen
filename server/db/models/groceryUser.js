const Sequelize = require('sequelize')
const db = require('../db')
const convert = require('convert-units');

const GroceryUser = db.define('groceryUser', {
  quantity: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  unit: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  instanceMethods: {
    addQauntity: function(quantity, unit) {
      let newQauntity;
      if (this.unit !== unit){
        newQauntity = convert(quantity).from(unit).to(this.unit);
      }
      else newQauntity = quantity;
      this.quantity += newQauntity
    }
  }
})

module.exports = GroceryUser
