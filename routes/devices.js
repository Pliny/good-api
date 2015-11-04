var express = require('express');
var router = express.Router();
var db     = require('../models');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:device_id', function(req, res, next) {
  db.Device.findOne({where: { device_id : req['params']['device_id']}})
    .then(function(device) {
      if(device) {
        res.send(device);
      }
      else {
        res.sendStatus(404);
      }
    });
});

module.exports = router;
