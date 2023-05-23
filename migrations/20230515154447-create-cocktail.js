/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
'use strict'

const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({ context }) {
    const { queryInterface } = context.sequelize
    await queryInterface.createTable('Cocktails', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cocktailId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
    })

    await queryInterface.createTable('Tags', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tagId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
    })

    await queryInterface.createTable('CocktailTags', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tagId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cocktailId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Cocktails')
    await queryInterface.dropTable('Tags')
    await queryInterface.dropTable('CocktailTags')
  }
}
