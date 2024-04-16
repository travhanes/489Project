const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Product extends Model {

    static async findProduct(productid){
        try {
            const product = await Product.findByPk(productid)
            return product ? product : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

Product.init({
  productid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  productname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productdesc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  productprice: {
    type: DataTypes.FLOAT, 
    allowNull: false
  },
  publisherid: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize, 
  modelName: 'Product'
});

module.exports = Product