"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReportHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReportHistory.belongsTo(models.UserDetail, {
        foreignKey: "user_detail_id",
        as: "userDetail", // Alias for the relation
      });
    }
  }
  ReportHistory.init(
    {
      user_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "UserDetails",
          key: "id",
        },
      },
      heart_rate: DataTypes.STRING,
      blood_glucose: DataTypes.STRING,
      spo2: DataTypes.STRING,
      hrv: DataTypes.STRING,
      bmi: DataTypes.STRING,
      mood: DataTypes.STRING,
      blood_pressure: DataTypes.STRING,
      fatigue: DataTypes.STRING,
      overall_health: DataTypes.STRING,
      error: DataTypes.STRING,
      accuracy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ReportHistory",
    }
  );
  return ReportHistory;
};
