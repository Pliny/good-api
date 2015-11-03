'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'device_id', {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'device_id', {
      allowNull: true,
      unique: false,
      type: Sequelize.STRING
    });
  }
};
