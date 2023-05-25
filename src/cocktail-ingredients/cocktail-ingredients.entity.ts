import { DataTypes, Sequelize } from 'sequelize'

interface ICocktailIngredient {
  tagId: string;
  ingredientId: string;
  unitCount: number;
}

const CocktailIngredientEntity = (sequelize: Sequelize) => sequelize.define('CocktailTag', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cocktailId: {
    type: DataTypes.STRING,
  },
  ingredientId: {
    type: DataTypes.STRING,
  },
  unitCount: {
    type: DataTypes.NUMBER,
  }
})

export {
  CocktailIngredientEntity as CocktailIngredient,
  ICocktailIngredient
}
