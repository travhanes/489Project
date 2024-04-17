const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class User extends Model {

    static async findUser(username, password){
        try {
            const user = await User.findByPk(username)
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
    type: DataTypes.INTEGER,
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