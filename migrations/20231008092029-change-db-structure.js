/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
'use strict'

const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.addColumn('Cocktails', 'tagIds', {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    })
    await queryInterface.dropTable('CocktailTags')
  },

  async down ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.removeColumn('Cocktails', 'tagIds')
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
  }
}
