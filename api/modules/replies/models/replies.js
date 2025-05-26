'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Replies extends Model {
    static associate(models) {
      // A reply belongs to a user
      Replies.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }

  Replies.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // This should match your users table
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(100),
    },
    category: {
      type: DataTypes.STRING(50),
    },
    content: {
      type: DataTypes.TEXT,
    },
    variables: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // Sequelize supports TEXT[]
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
  }, {
    sequelize,
    modelName: 'Replies',
    tableName: 'Replies',
    underscored: true,
    timestamps: true,
  });

  return Replies;
};
