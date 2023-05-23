import { DataTypes, Sequelize } from 'sequelize'
import { nanoid } from 'nanoid'

interface ICocktail {
  id: number;
  tagId: string;
  name: string;
  description: string;
  abv: number;
  createdAt: Date;
  updatedAt: Date;
}

const CocktailsEntity = (sequelize: Sequelize) => sequelize.define('Cocktail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cocktailId: {
    type: DataTypes.STRING,
    defaultValue: () => nanoid()
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  abv: {
    type: DataTypes.DECIMAL,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
})

export {
  CocktailsEntity as Cocktail,
  ICocktail
}
