const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Library extends Model {

    static async findLibrary(userid) {
        try {
            const library = await Library.findByPk(userid)
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
  dateAdded: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'Library'
});

module.exports = Library