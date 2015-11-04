'use strict';

module.exports = function(sequelize, DataTypes) {
  var Device = sequelize.define('Device', {
    name: DataTypes.STRING,
    device_id: DataTypes.STRING,
    sample_interval: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Device;
};
