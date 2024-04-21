const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid');

class User extends Model {

    // note: doesn't find by primary key, instead by username and password
    static async findUser(username, password){
        try {
            const user = await User.findOne({ where: {username: username, password: password}})
            if(user && user.password === password){
                return user
            }else{
                return null
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    static async existingUsername(username) {
      const user = await User.findByPk(username)
      if (user !== null) {
        return true
      }
      else {
        return false
      }
    }

    static async findAdmin(username, password)
    {
      try {
        const admin = await User.findByPk(username)
        if(user && user.password === password && user.isAdmin)
        {
          return user
        }
        else
        {
          return null
        }
      }
      catch (err)
      {
        console.log(err)
        return null
      }
    }

}

User.init({
  userid: {
    type: DataTypes.UUIDV4,
    defaultValue: sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
  }
}, {
  sequelize, 
  modelName: 'User'
});

module.exports = User