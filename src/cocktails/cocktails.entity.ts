import { DataTypes, Sequelize } from 'sequelize'
import { nanoid } from 'nanoid'

interface ICocktail {
    id: number;
    tagId: string;
    name: string;
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
  }
})

export {
  CocktailsEntity as Cocktail,
  ICocktail
}
