/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
'use strict'

const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.addColumn('Tags', 'type', {
      type: DataTypes.STRING,
    })
  },

  async down ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.removeColumn('Tags', 'type')
  }
}
