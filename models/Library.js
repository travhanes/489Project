const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Library extends Model {

    static async findLibraries(userid) {
        try {
            const library = await Library.findAll({where: {userid: userid}})
            return library ? library : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

Library.init({
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  downloadDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'Library'
});

module.exports = Library