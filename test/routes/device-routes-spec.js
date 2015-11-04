'use strict';

process.env['NODE_ENV'] = 'test';

var should = require('should');
var db = require('../../models');
var request = require('supertest');
var app = require('../../app');

describe('devices/', function() {

  describe('by mac addr', function() {

    describe('unsuccessfully', function() {

      it('should return 404 when mac address doesn\'t exist', function(done) {
        request(app)
          .get('/devices/987654321')
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
          .get('/devices/987654321')
          .expect(200, done);
      });

      it('should have the proper headers set', function(done) {
        request(app)
          .get('/devices/987654321')
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });
    });
  });
});
