'use strict';

var express = require('express');
var router = express.Router();
var db     = require('../models');

/* CREATE */
router.post('/', function(req, res, next) {
  db.SampleData.create(req.body)
    .then(function(sampledata) {
      res.status(201).send(sampledata);
    })
    .catch(function(err) {
      res.status(400).send({ error: err.message } );
    });
});

/* SHOW */
router.get('/:device_id', function(req, res, next) {
  db.Device.findOne({where: {device_id: req.params.device_id}})
  .then(function(device) {
    if(device) {
      var direction = (req.query.d == 'reverse') ? "DESC" : "ASC";
      var options = {order: '"createdAt" ' + direction};

      if(req.query.c) {
        options['limit'] = req.query.c;
      }

      return device.getSampleData(options);
    }
    else {
      res.sendStatus(404);
    }
  })
  .then(function(associations) {
    res.status(200).send(associations);
  });
});


module.exports = router;
