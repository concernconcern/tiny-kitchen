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
  }
}, {
  instanceMethods: {
    addQuantity: function(quantity, unit) {
      let newQuantity;
      if (this.unit && unit && this.unit !== unit){
        newQuantity = convert(quantity).from(unit).to(this.unit);
      }
      else newQuantity = quantity;
      this.quantity += newQuantity
    }
  }
})

module.exports = GroceryUser
