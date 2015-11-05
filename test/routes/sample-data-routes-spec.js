'use strict';

process.env['NODE_ENV'] = 'test';

var should = require('should');
var db = require('../../models');
var request = require('supertest');
var app = require('../../app');
var timekeeper = require('timekeeper');

var api = require('../../config/api-info.js');

describe('sampledata/', function() {

  describe('CREATE', function() {

    describe('successfully', function() {

      var seed = {"value": 8, "device_id": 1, "session_start": true};

      afterEach(function(done) {
        return db.SampleData.destroy({where: {}}).then(function() { done(); });
      });

      it('should have a route', function(done) {
        request(app)
        .post(api.NAMESPACE + '/sampledata')
        .send(seed)
        .expect(function(res) {
          delete res.body.createdAt;
          delete res.body.updatedAt;
          delete res.body.id;
        })
        .expect(201, seed)
        .end(done);
      });

      it('should create', function(done) {
        request(app)
        .post(api.NAMESPACE + '/sampledata')
        .type('json')
        .send(seed)
        .expect(function(res) {
          db.SampleData.findOne({where:{value: 8}})
          .then(function(sampledata) {
            should.exist(sampledata);
            sampledata.device_id.should.equal(1);
            sampledata.session_start.should.equal(true);
          });
        })
        .end(done);
      });
    });

    describe('unsuccessfully', function() {

      it('should not create the object', function(done) {
        request(app)
        .post(api.NAMESPACE + '/sampledata')
        .type('json')
        .send({"value": null, "device_id": null})
        .expect(400, done);
      });

      it('should give a meaningful message in JSON format', function(done) {
        request(app)
        .post(api.NAMESPACE + '/sampledata')
        .type('json')
        .send({"value": null, "device_id": null})
        .expect(400, /error/)
        .end(done);
      });
    });
  });

  describe('SHOW', function() {

    var sampledataObj = [], deviceObj ;

    beforeEach(function(done) {

      var time = new Date();

      sampledataObj[0] = {"value": 8, "session_start": true};
      sampledataObj[1] = {"value": 4, "session_start": false};
      sampledataObj[2] = {"value": 6, "session_start": false};
      deviceObj    = { "device_id": "987654321" };

      return db.Device.create(deviceObj)
      .then(function(deviceObj) {
        timekeeper.freeze(time);
        sampledataObj.forEach(function(ele, idx, ary) {
          var fakeTime = new Date(time);
          fakeTime.setDate(time.getDate()+idx);
          ele.device_id = deviceObj.id;
          ele.createdAt = fakeTime.toISOString();
        });
        return db.SampleData.bulkCreate(sampledataObj);
      })
      .then(function() { done() });
    });

    afterEach(function(done) {
      timekeeper.reset();
      db.Device.destroy({where: {}})
      .then(function() {
        return db.SampleData.destroy({where: {}});
      })
      .then(function() { done(); });
    });

    it('should have a route', function(done) {
      request(app)
      .get(api.NAMESPACE + '/sampledata/987654321')
      .expect(200, done);
    });

    describe('successfully', function() {

      it('should return all samples from a device', function(done) {
        request(app)
        .get(api.NAMESPACE + '/sampledata/987654321')
        .expect(function(res) {
          res.body.forEach(function(ele) {
            delete ele.updatedAt;
            delete ele.id;
          });
        })
        .expect(200, sampledataObj)
        .end(done);
      });

      it('should return all samples in reverse if requested', function(done) {
        request(app)
        .get(api.NAMESPACE + '/sampledata/987654321?d=reverse')
        .expect(function(res) {
          res.body.forEach(function(ele) {
            delete ele.updatedAt;
            delete ele.id;
          });
        })
        .expect(200, sampledataObj.reverse())
        .end(done);
      });

      it('should return only the requested number of samples', function(done) {
        request(app)
        .get(api.NAMESPACE + '/sampledata/987654321/?c=2')
        .expect(function(res) {
          res.body.forEach(function(ele) {
            delete ele.updatedAt;
            delete ele.id;
          });
        })
        .expect(200, sampledataObj.slice(0,2))
        .end(done);
      });

      it('should support all queries', function(done) {
        request(app)
        .get(api.NAMESPACE + '/sampledata/987654321/?d=reverse&c=2')
        .expect(function(res) {
          res.body.forEach(function(ele) {
            delete ele.updatedAt;
            delete ele.id;
          });
        })
        .expect(200, sampledataObj.reverse().slice(0,2))
        .end(done);
      });
    });

    describe('unsuccessfully', function() {

      it('should return 404 when device doesn\'t exist', function(done) {
        request(app)
        .get(api.NAMESPACE + '/sampledata/doesnotexist')
        .expect(404, done);
      });
    });
  });
});

