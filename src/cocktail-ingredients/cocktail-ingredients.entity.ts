import { DataTypes, Sequelize } from 'sequelize'

interface ICocktailIngredient {
  cocktailId: string;
  ingredientId: string;
  unitCount: number;
}

const CocktailIngredientEntity = (sequelize: Sequelize) => sequelize.define('CocktailIngredient', {
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
