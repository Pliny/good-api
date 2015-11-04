'use strict';

var should = require('should');
var db = require('../../models');

describe('test', function() {
  it('should return -1 when the value is not present', function() {
    [1,2,3].indexOf(5).should.equal(-1);
    [1,2,3].indexOf(0).should.equal(-1);
  });
});

describe('User', function() {

  it('should exist', function() {
    var table = db.sequelize.models['User']
    should.exist(table);
    table.should.be.an.Object();
  });

  it('should write to the db', function(done) {
    return db.sequelize.transaction().then(function (t) {
      return db.User.create(
        {"name":"JoeBlo", "sample_interval": 3, "device_id": "123456789"},
        {transaction: t}
      ).then(function (user) {
        user.device_id.should.equal("123456789");
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
        return db.User.create(
          {"name":"JoeBlew", "sample_interval": 3, "device_id": "123456789"},
          { transaction: t }
        ).then(function() { done(); });
      });
    });

    after(function() {
      pendingTrans.rollback();
    });

    it('should have a name', function() {
      return db.User.findOne({transaction: pendingTrans}).then(function(user) {
        return user.name.should.equal("JoeBlew");
      });
    });

    it('should have a device_id', function() {
      return db.User.findOne({transaction: pendingTrans}).then(function(user) {
        return user.device_id.should.equal("123456789");
      });
    });

    it('should have a sample_interval', function() {
      return db.User.findOne({transaction: pendingTrans}).then(function(user) {
        return user.sample_interval.should.equal(3);
      });
    });
  });

  describe('validation', function() {

    var pendingTrans;

    beforeEach(function (done) {
      return db.sequelize.transaction().then(function (t) {
        pendingTrans = t;
        return db.User.create(
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
        return db.User.create(
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
        return db.User.create(
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
        return db.User.create(
          {"name":"JoeBla", "device_id": "12345678"},
          { transaction: pendingTrans }
        ).then(function(user) {
          should.exist(user.sample_interval)
          user.sample_interval.should.equal(2);
        });
      });

      it('should not be null', function() {
        return db.User.create(
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
});
