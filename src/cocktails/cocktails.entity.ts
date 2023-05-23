import { DataTypes, Sequelize } from 'sequelize'
import { nanoid } from 'nanoid'
import { ITag } from '../tags/tags.entity'
import { IReview } from '../reviews/reviews.entity'
import { IIngredient } from '../ingredients/ingredients.entity'

interface ICocktailIngredient {
  ingredient: IIngredient;
  unitCount: number;
}

interface ICocktail {
  id: number;
  cocktailId: string;
  tagId: string;
  name: string;
  description: string;
  abv: number;
  createdAt: Date;
  updatedAt: Date;
  tags?: ITag[];
  reviews?: IReview[];
  ingredients?: ICocktailIngredient[];
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
  ICocktail,
  ICocktailIngredient,
}
