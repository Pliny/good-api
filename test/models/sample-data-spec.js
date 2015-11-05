'use strict';

var should = require('should');
var db = require('../../models');

describe('SampleData', function() {

  it('should exist', function() {
    var table = db.sequelize.models['SampleData']
    should.exist(table);
    table.should.be.an.Object();
  });

  it('should write to the db', function(done) {
    return db.sequelize.transaction().then(function (t) {
      return db.SampleData.create(
        {"value": 3, "device_id": 1, "session_start": true },
        {transaction: t}
      ).then(function (sample_data) {
        sample_data.device_id.should.equal(1);
        sample_data.value.should.equal(3);
        sample_data.session_start.should.equal(true);
        t.rollback();
        done();
      });
    });
  });


  describe('validation', function() {

    var pendingTrans;

    afterEach(function() {
      pendingTrans && pendingTrans.rollback();
    });

    it("'value' should not be null", function() {
      return db.sequelize.transaction().then(function (t) {
        pendingTrans = t;
        return db.SampleData.create(
          {"value": null, "device_id": 1, "session_start": true },
          { transaction: t }
        ).then(function() {
          should.fail(null, null, "DB allowed null 'value'");
        }).catch(function(err) {
          if(err.name === "AssertionError") {
            throw err;
          }
          else {
            err.name.should.equal("SequelizeDatabaseError");
            err.message.should.match(/value.*not-null/);
          }
        })
      });
    });

    it("'device_id' should not be null", function() {
      return db.sequelize.transaction().then(function (t) {
        pendingTrans = t;
        return db.SampleData.create(
          {"value": 5, "device_id": null, "session_start": true },
          { transaction: t }
        ).then(function() {
          should.fail(null, null, "DB allowed null 'device_id'");
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
  });
});
