const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class ShoppingCart extends Model {

  static async findCart(userid) {
    try {
      const cart = await ShoppingCart.findAll({ where: { userid: userid } })
      return cart ? cart : null;
    } catch (error) {
      console.log(error)
      return null
    }
  }

  static async findCartProduct(userid, productid) {
    try {
      const cart = await ShoppingCart.findOne({ where: { userid: userid, productid: productid } })
      return cart ? cart : null;
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

ShoppingCart.init({
  userid: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  productid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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