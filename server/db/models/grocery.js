//this association table is to store details of each users' grocery. Users may share the same grocery item titles, but they will still be separate entries because unit and quantity are different for each user.

const Sequelize = require('sequelize')
const db = require('../db')
const convert = require('convert-units');

const Grocery = db.define('grocery', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  quantity: {
    type: Sequelize.FLOAT,
    defaultValue: 1
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

module.exports = Grocery;
