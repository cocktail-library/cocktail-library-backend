import { DataTypes, Sequelize } from 'sequelize'
import { nanoid } from 'nanoid'
import { ITag } from '../tags/tags.entity'
import { IReview } from '../reviews/reviews.entity'
import { IExtendedCocktailIngredient } from '../ingredients/ingredients.entity'

interface ICocktail {
  id: number;
  cocktailId: string;
  tagId: string;
  name: string;
  slug: string;
  isTasted: boolean;
  rating: number;
  recipe: string;
  previewAssetStrId: string;
  description: string;
  abv: number;
  createdAt: Date;
  updatedAt: Date;
  tagIds: string[];
  tags?: ITag[];
  reviews?: IReview[];
  ingredients?: IExtendedCocktailIngredient[];
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
  slug: {
    type: DataTypes.STRING,
  },
  tagIds: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  isTasted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
  },
  recipe: {
    type: DataTypes.TEXT,
  },
  previewAssetStrId: {
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
}
