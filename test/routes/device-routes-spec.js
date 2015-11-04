'use strict';

process.env['NODE_ENV'] = 'test';

var should = require('should');
var db = require('../../models');
var request = require('supertest');
var app = require('../../app');

var api = require('../../config/api-info.js');

describe('devices/', function() {

  describe('SHOW', function() {

    describe('unsuccessfully', function() {

      it('should return 404 when mac address doesn\'t exist', function(done) {
        request(app)
          .get(api.NAMESPACE + '/devices/987654321')
          .expect(404, done);
      });
    });

    describe('successfully', function() {

      beforeEach(function (done) {
        return db.Device.create(
          {"name":"JoeBla", "sample_interval": 6, "device_id": "987654321"}
        ).then(function() { done(); });
      });

      afterEach(function(done) {
        return db.Device.destroy({where: {name: "JoeBla"}}).then(function() { done(); });
      });

      it('should have a :device_id route', function(done) {
        request(app)
          .get(api.NAMESPACE + '/devices/987654321')
          .expect(200, done);
      });

      it('should have the proper headers set', function(done) {
        request(app)
          .get(api.NAMESPACE + '/devices/987654321')
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });
    });
  });

  describe('INDEX', function() {

    var seed = [
      {"name":"JoeBla", "sample_interval": 6, "device_id": "987654321"},
      {"name":"MyGood", "sample_interval": 2, "device_id": "876543457"},
      {"name":"device", "sample_interval": 7, "device_id": "765433458"}
    ];

    beforeEach(function (done) {
      return db.Device.bulkCreate(seed).then(function() { done(); });
    });

    afterEach(function(done) {
      return db.Device.destroy({where: {}}).then(function() { done(); });
    });

    it('should have a /devices route', function(done) {
      request(app)
      .get(api.NAMESPACE + '/devices')
      .expect(200, done);
    });

    it('should have the proper headers set', function(done) {
      request(app)
      .get(api.NAMESPACE + '/devices')
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
    });

    it('should return the list of all devices', function(done) {
      request(app)
      .get(api.NAMESPACE + '/devices')
      .expect(200, seed)
      .end(done);
    });
  });

  describe('CREATE', function() {

    describe('successfully', function() {

      var seed = {"name": "test", "device_id": "098765432", "sample_interval": 7};

      afterEach(function(done) {
        return db.Device.destroy({where: {}}).then(function() { done(); });
      });

      it('should create', function(done) {
        request(app)
        .post(api.NAMESPACE + '/devices')
        .type('json')
        .send(seed)
        .expect(function(res) {
          delete res.body.createdAt;
          delete res.body.updatedAt;
          delete res.body.id;
        })
        .expect(201, seed)
        .end(done);
      });
    });

    describe('unsuccessfully', function() {

      it('should not create the object', function(done) {
        request(app)
        .post(api.NAMESPACE + '/devices')
        .type('json')
        .send({"name": "sdf", "device_id": null})
        .expect(400, done);
      });

      it('should give a meaningful message in JSON format', function(done) {
        request(app)
        .post(api.NAMESPACE + '/devices')
        .type('json')
        .send({"name": "sdf", "device_id": null})
        .expect(400, /error/)
        .end(done);
      });
    });
  });

  describe('UPDATE', function() {

    beforeEach(function (done) {
      return db.Device.create(
        {"name":"JoeBla", "sample_interval": 6, "device_id": "987654321"}
      ).then(function() { done(); });
    });

    afterEach(function(done) {
      return db.Device.destroy({where: {}}).then(function() { done(); });
    });

    describe('successfully', function() {

      it('should update the name', function(done) {
        request(app)
        .patch(api.NAMESPACE + '/devices/987654321')
        .type('json')
        .send({'name' : "Bubu" })
        .expect(200)
        .expect(function(res) {
          db.Device.findOne({where: { name: "Bubu" }})
            .then(function(device) {
              should.exist(device)
              device.name.should.equal("Bubu");
            })
        })
        .end(done);
      });

      it('should return the modified object', function(done) {
        request(app)
        .patch(api.NAMESPACE + '/devices/987654321')
        .type('json')
        .send({'name' : "Bubu" })
        .expect(200)
        .expect(function(res) {
          should.exist(res.body.name);
          res.body.name.should.equal('Bubu');
        })
        .end(done);
      });
    });

    describe('unsuccessfully', function() {

      it('should not create a new object if it doesn\'t exist', function(done) {
        request(app)
        .patch(api.NAMESPACE + '/devices/badid')
        .type('json')
        .send({'name' : "Bubu" })
        .expect(function(res) {
          db.Device.findOne({where: {name: "Bubu"}})
            .then(function(device) {
              should.not.exist(device);
            });
        })
        .end(done);
      });

      it('should return the proper error message', function(done) {
        request(app)
        .patch(api.NAMESPACE + '/devices/badid')
        .type('json')
        .send({'name' : "Bubu" })
        .expect(404, /error/)
        .end(done);
      });

      it('should handle validation errors', function(done) {
        request(app)
        .patch(api.NAMESPACE + '/devices/987654321')
        .type('json')
        .send({'device_id' : null })
        .expect(403, /error/)
        .end(done);
      });
    });
  });
});
