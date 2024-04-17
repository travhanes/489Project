const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class OrderItem extends Model {

    static async findOrderItem(orderid) {
        try {
            const order = await Order.findByPk(orderid)
            return order ? order : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

OrderItem.init({
  orderid: {
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
  }
}, {
  sequelize, 
  modelName: 'OrderItem'
});

module.exports = OrderItem