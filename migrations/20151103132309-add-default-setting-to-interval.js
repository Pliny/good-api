'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'sample_interval', {
      defaultValue: 2,
      allowNull: false,
      type: Sequelize.INTEGER
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'sample_interval', {
      allowNull: true,
      type: Sequelize.INTEGER
    });
  }
};
