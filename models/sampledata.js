'use strict';

module.exports = function(sequelize, DataTypes) {
  var SampleData = sequelize.define('SampleData', {
    value: DataTypes.INTEGER,
    device_id: DataTypes.INTEGER,
    session_start: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return SampleData;
};
