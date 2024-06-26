const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Order extends Model {

    static async findOrder(orderid) {
        try {
            const order = await Order.findByPk(orderid)
            return order ? order : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }

    static async findOrders(userid) {
        try {
            const orders = await Order.findAll({where:{userid: userid}})
            return orders ? orders : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

Order.init({
  orderid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  userid: {
    type: DataTypes.UUIDV4,
    allowNull: false
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dateOrdered: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dateDelivered: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentOption: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'Order'
});

module.exports = Order