var express = require('express');
var router = express.Router();
var db     = require('../models');

/* INDEX */
router.get('/', function(req, res, next) {
  db.Device.findAll({attributes: [ 'device_id', 'name', 'sample_interval' ], where: {}})
    .then(function(devices) {
      res.send(devices);
    });
});

/* SHOW */
router.get('/:device_id', function(req, res, next) {
  db.Device.findOne({attributes: [ 'device_id', 'name', 'sample_interval' ], where: { device_id : req['params']['device_id']}})
    .then(function(device) {
      if(device) {
        res.send(device);
      }
      else {
        res.sendStatus(404);
      }
    });
});

/* CREATE */
router.post('/', function(req, res, next) {
  db.Device.create(req.body)
    .then(function(device) {
      res.status(201).send(device);
    }).catch(function(err) {
      res.status(400).send({ error: err.message } );
    });
});

/* UPDATE */
router.patch('/:device_id', function(req, res, next) {
  db.Device.findOne({where: {'device_id': req['params'].device_id}})
    .then(function(device) {
      if(device) {
        for(var obj in req.body) {
          device.setDataValue(obj, req.body[obj]);
        }
        return device.save();
      }
      else {
        res.status(404).send({error: "'" + req['params'].device_id + "' device cannot be found."})
      }
    })
    .then(function(device) {
      res.status(200).send(device);
    }).catch(function(err) {
      res.status(403).send({error: err.message});
    });
});

module.exports = router;
