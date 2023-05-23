import { DataTypes, Sequelize } from 'sequelize'
import { nanoid } from 'nanoid'

interface IReview {
  id: number;
  reviewId: string;
  cocktailId: string;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewsEntity = (sequelize: Sequelize) => sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reviewId: {
    type: DataTypes.STRING,
    defaultValue: () => nanoid()
  },
  cocktailId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL,
  },
  text: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  }
})

export {
  ReviewsEntity as Review,
  IReview
}
