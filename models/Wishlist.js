const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Wishlist extends Model {

    static async findWishlist(userid) {
        try {
            const wishlist = await Wishlist.findByPk(userid)
            return wishlist ? wishlist : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

Wishlist.init({
  userid: {
    type: DataTypes.UUIDV4,
    allowNull: false
  },
  productid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dateAdded: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'Wishlist'
});

module.exports = Wishlist