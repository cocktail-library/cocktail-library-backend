import { DataTypes, Sequelize } from 'sequelize'

interface ICocktailTag {
  tagId: string;
  cocktailId: string;
}

const CocktailTagEntity = (sequelize: Sequelize) => sequelize.define('CocktailTag', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cocktailId: {
    type: DataTypes.STRING,
  },
  tagId: {
    type: DataTypes.STRING,
  },
})

export {
  CocktailTagEntity as CocktailTag,
  ICocktailTag
}
