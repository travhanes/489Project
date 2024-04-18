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

    static async findByPublisher (publisherid) {
      try {
        const unfilteredProducts = await Product.findAll();

        var products = [];

        if (unfilteredProducts != null) {
          for (var i = 0; i < unfilteredProducts.length; i++) {
            if (unfilteredProducts[i].publisherid == publisherid) {
              products.push(unfilteredProducts[i]);
            }
          }
        }

        return products ? products : null;
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
  publisherid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productimage: {
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
  }
}, {
  sequelize, 
  modelName: 'Product'
});

module.exports = Product