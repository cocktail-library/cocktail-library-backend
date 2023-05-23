import { DataTypes, Sequelize } from 'sequelize'
import { nanoid } from 'nanoid'

interface ITag {
  id: number;
  tagId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagsEntity = (sequelize: Sequelize) => sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tagId: {
    type: DataTypes.STRING,
    defaultValue: () => nanoid()
  },
  name: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
})

export {
  TagsEntity as Tag,
  ITag
}
