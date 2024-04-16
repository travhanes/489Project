const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/websitedb.sqlite'
})

module.exports = sequelize