"use strict";
const {
  Model,
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WhitelistEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models) {
      // define association here
    }
  }
  WhitelistEntry.init({
    discordId:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    mcUUID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "WhitelistEntry",
  });
  return WhitelistEntry;
};
