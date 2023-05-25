import { DataTypes, Sequelize } from 'sequelize'
import { nanoid } from 'nanoid'

interface IIngredient {
  id: number;
  ingredientId: string;
  name: string;
  unitName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IExtendedCocktailIngredient extends IIngredient {
  unitCount: number;
}

const IngredientsEntity = (sequelize: Sequelize) => sequelize.define('Ingredient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ingredientId: {
    type: DataTypes.STRING,
    defaultValue: () => nanoid()
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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

export {
  IngredientsEntity as Ingredient,
  IIngredient,
  IExtendedCocktailIngredient,
}
