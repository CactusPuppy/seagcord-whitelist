"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("WhitelistEntries", {
      discordId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      mcUUID: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, _) => {
    await queryInterface.dropTable("WhitelistEntries");
  },
};
