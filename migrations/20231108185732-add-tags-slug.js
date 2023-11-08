/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
'use strict'

const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.addColumn('Tags', 'slug', {
      type: DataTypes.STRING,
    })
  },

  async down ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.removeColumn('Tags', 'slug')
  }
}
