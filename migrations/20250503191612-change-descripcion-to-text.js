'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Disfrazs', 'descripcion', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Disfrazs', 'descripcion', {
      type: Sequelize.STRING(500),
      allowNull: false
    });
  }
};
