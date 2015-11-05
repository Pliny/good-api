'use strict';

var should = require('should');
var db = require('../../models');

describe('Device', function() {

  it('should exist', function() {
    var table = db.sequelize.models['Device']
    should.exist(table);
    table.should.be.an.Object();
  });

  it('should write to the db', function(done) {
    return db.sequelize.transaction().then(function (t) {
      return db.Device.create(
        {"name":"JoeBlo", "sample_interval": 3, "device_id": "123456789"},
        {transaction: t}
      ).then(function (device) {
        device.device_id.should.equal("123456789");
        t.rollback();
        done();
      });
    });
  });

  describe('#attributes', function () {

    var pendingTrans;

    before(function (done) {
      return db.sequelize.transaction().then(function (t) {
        pendingTrans = t;
        return db.Device.create(
          {"name":"JoeBlew", "sample_interval": 3, "device_id": "123456789"},
          { transaction: t }
        ).then(function() { done(); });
      });
    });

    after(function() {
      pendingTrans.rollback();
    });

    it('should have a name', function() {
      return db.Device.findOne({transaction: pendingTrans}).then(function(device) {
        return device.name.should.equal("JoeBlew");
      });
    });

    it('should have a device_id', function() {
      return db.Device.findOne({transaction: pendingTrans}).then(function(device) {
        return device.device_id.should.equal("123456789");
      });
    });

    it('should have a sample_interval', function() {
      return db.Device.findOne({transaction: pendingTrans}).then(function(device) {
        return device.sample_interval.should.equal(3);
      });
    });
  });

  describe('validation', function() {

    var pendingTrans;

    beforeEach(function (done) {
      return db.sequelize.transaction().then(function (t) {
        pendingTrans = t;
        return db.Device.create(
          {"name":"JoeBla", "sample_interval": 6, "device_id": "987654321"},
          { transaction: t }
        ).then(function() { done(); });
      });
    });

    afterEach(function() {
      pendingTrans.rollback();
    });

    describe('of device_id', function() {

      it('should be unique', function() {
        return db.Device.create(
          {"name":"JoeBla", "sample_interval": 6, "device_id": "987654321"},
          { transaction: pendingTrans }
        ).then(function() {
          should.fail(null, null, "DB allowed same device_id");
        }).catch(function(err) {
          if(err.name === "AssertionError") {
            throw err;
          }
          else {
            err.name.should.equal("SequelizeUniqueConstraintError");
          }
        });
      });

      it('should not be null', function() {
        return db.Device.create(
          {"name":"JoeBla", "sample_interval": 6, "device_id": null },
          { transaction: pendingTrans }
        ).then(function() {
          should.fail(null, null, "DB allowed null device_id");
        }).catch(function(err) {
          if(err.name === "AssertionError") {
            throw err;
          }
          else {
            err.name.should.equal("SequelizeDatabaseError");
            err.message.should.match(/device_id.*not-null/);
          }
        })
      });
    });

    describe('of sample_interval', function() {

      it('should default to 2', function() {
        return db.Device.create(
          {"name":"JoeBla", "device_id": "12345678"},
          { transaction: pendingTrans }
        ).then(function(device) {
          should.exist(device.sample_interval)
          device.sample_interval.should.equal(2);
        });
      });

      it('should not be null', function() {
        return db.Device.create(
          {"name":"JoeBla", "sample_interval": null, "device_id": "12345678"},
          { transaction: pendingTrans }
        ).then(function() {
          should.fail(null, null, "DB allowed null sample_interval");
        }).catch(function(err) {
          if(err.name === "AssertionError") {
            throw err;
          }
          else {
            err.name.should.equal("SequelizeDatabaseError");
            err.message.should.match(/sample_interval.*not-null/);
          }
        });
      });
    });
  });

  describe('.associations', function() {

    it('has many SampleData objects', function(done) {
      var trans;
      var device;
      return db.sequelize.transaction()
      .then(function(t) {
        trans = t;
        return db.Device.create({ "device_id": "987654321" }, {transaction: t});
      })
      .then(function(deviceObj) {
        var sampledataObj = [];
        device = deviceObj;
        sampledataObj[0] = {"device_id": deviceObj.id, "value": 8, "session_start": true};
        sampledataObj[1] = {"device_id": deviceObj.id, "value": 4, "session_start": false};
        sampledataObj[2] = {"device_id": deviceObj.id, "value": 6, "session_start": false};
        return db.SampleData.bulkCreate(sampledataObj, {transaction: trans});
      })
      .then(function() {
        should.exist(device.getSampleData);
        return device.getSampleData({transaction: trans});
      })
      .then(function(sampledata) {
        sampledata.length.should.equal(3);
        trans.rollback();
        done();
      });
    });
  });
});
