/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
'use strict'

const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({ context }) {
    const { queryInterface } = context.sequelize
    await queryInterface.createTable('Reviews', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reviewId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cocktailId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    })

    await queryInterface.createTable('Ingredients', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ingredientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      unitName: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    })

    await queryInterface.createTable('CocktailIngredients', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ingredientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cocktailId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unitCount: {
        type: DataTypes.DECIMAL,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    })

    await queryInterface.addColumn('Cocktails', 'authorReview', { type: DataTypes.TEXT })
    await queryInterface.addColumn('Cocktails', 'abv', { type: DataTypes.DECIMAL })

    await queryInterface.addColumn('Cocktails', 'createdAt', { type: DataTypes.DATE })
    await queryInterface.addColumn('Cocktails', 'updatedAt', { type: DataTypes.DATE })

    await queryInterface.addColumn('Tags', 'createdAt', { type: DataTypes.DATE })
    await queryInterface.addColumn('Tags', 'updatedAt', { type: DataTypes.DATE })

    await queryInterface.addColumn('CocktailTags', 'createdAt', { type: DataTypes.DATE })
    await queryInterface.addColumn('CocktailTags', 'updatedAt', { type: DataTypes.DATE })
  },

  async down ({ context }) {
    const { queryInterface } = context.sequelize

    await queryInterface.dropTable('Reviews')
    await queryInterface.dropTable('Ingredients')
    await queryInterface.dropTable('CocktailIngredients')

    await queryInterface.removeColumn('Cocktails', 'authorReview')
    await queryInterface.removeColumn('Cocktails', 'abv')

    await queryInterface.removeColumn('Cocktails', 'createdAt')
    await queryInterface.removeColumn('Cocktails', 'updatedAt')

    await queryInterface.removeColumn('Tags', 'createdAt')
    await queryInterface.removeColumn('Tags', 'updatedAt')

    await queryInterface.removeColumn('CocktailTags', 'createdAt')
    await queryInterface.removeColumn('CocktailTags', 'updatedAt')
  }
}
