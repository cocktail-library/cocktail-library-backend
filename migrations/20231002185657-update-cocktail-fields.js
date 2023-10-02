/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
'use strict'

const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.addColumn('Cocktails', 'slug', { type: DataTypes.STRING })
    await queryInterface.addColumn('Cocktails', 'isTasted', { type: DataTypes.BOOLEAN, defaultValue: false })
    await queryInterface.addColumn('Cocktails', 'rating', { type: DataTypes.DECIMAL, defaultValue: 0 })
    await queryInterface.addColumn('Cocktails', 'recipe', { type: DataTypes.TEXT })
    await queryInterface.addColumn('Cocktails', 'previewAssetStrId', { type: DataTypes.STRING })
  },

  async down ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.removeColumn('Cocktails', 'slug')
    await queryInterface.removeColumn('Cocktails', 'isTasted')
    await queryInterface.removeColumn('Cocktails', 'rating')
    await queryInterface.removeColumn('Cocktails', 'recipe')
    await queryInterface.removeColumn('Cocktails', 'previewAssetStrId')
  }
}
