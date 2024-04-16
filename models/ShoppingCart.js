const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class ShoppingCart extends Model {

    static async findCart(userid) {
        try {
            const cart = await ShoppingCart.findByPk(userid)
            return cart ? cart : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

ShoppingCart.init({
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dateAdded: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'ShoppingCart'
});

module.exports = ShoppingCart