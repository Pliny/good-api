'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      device_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      sample_interval: {
        allowNull: false,
        defaultValue: 2,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(function() {
      return queryInterface.sequelize.query('SELECT * FROM "Users";', { type: Sequelize.QueryTypes.SELECT });
    })
    .then(function (results) {
      var sql = '';
      for(var obj in results) {
        sql += 'INSERT INTO "Devices" (name, device_id, sample_interval, "createdAt", "updatedAt") VALUES (' +
                "'" + results[obj].name + "'" + ',' +
                "'" + results[obj].device_id + "'" + ',' +
                results[obj].sample_interval + ',' +
                "'" + results[obj].createdAt.toUTCString() + "'" + ',' +
                "'" + results[obj].updatedAt.toUTCString() + "'" + ');';
      }
      return queryInterface.sequelize.query(sql);
    })
    .then(function() {
      return queryInterface.dropTable('Users');
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      device_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sample_interval: {
        allowNull: false,
        defaultValue: 2,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(function() {
      return queryInterface.sequelize.query('SELECT * FROM "Devices";', { type: Sequelize.QueryTypes.SELECT });
    })
    .then(function (results) {
      var sql = '';
      for(var obj in results) {
        sql += 'INSERT INTO "Users" (name, device_id, sample_interval, "createdAt", "updatedAt") VALUES (' +
                "'" + results[obj].name + "'" + ',' +
                "'" + results[obj].device_id + "'" + ',' +
                results[obj].sample_interval + ',' +
                "'" + results[obj].createdAt.toUTCString() + "'" + ',' +
                "'" + results[obj].updatedAt.toUTCString() + "'" + ');';
      }
      return queryInterface.sequelize.query(sql);
    })
    .then(function() {
      return queryInterface.dropTable('Devices');
    });
  }
};
