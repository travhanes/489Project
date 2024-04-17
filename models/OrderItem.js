const sequelize = require('../db')
const { Model, DataTypes, or } = require('sequelize')

class OrderItem extends Model {

    static async findItems(orderid) {
        try {
            const items = await OrderItem.findAll({where: {orderid: orderid}})
            return items ? items : null;
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