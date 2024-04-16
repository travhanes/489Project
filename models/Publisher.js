const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Publisher extends Model {

    static async findPublisher(publisherid){
        try {
            const publisher = await Publisher.findByPk(publisherid)
            return publisher ? publisher : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

Publisher.init({
  publisherid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  publishername: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publisherdesc: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'Publisher'
});

module.exports = Publisher