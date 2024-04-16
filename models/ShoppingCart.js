const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class ShoppingCart extends Model {

    static async findProduct(cartid){
        try {
            const cart = await ShoppingCart.findByPk(cartid)
            return cart ? cart : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

ShoppingCart.init({
  cartid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  publisherid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cartname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cartdesc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cartprice: {
    type: DataTypes.FLOAT, 
    allowNull: false
  }
}, {
  sequelize, 
  modelName: 'ShoppingCart'
});

module.exports = ShoppingCart