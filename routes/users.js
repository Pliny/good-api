var express = require('express');
var router = express.Router();
var db     = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:device_id', function(req, res, next) {
  db.User.findOne({where: { device_id : req['params']['device_id']}})
    .then(function(user) {
      if(user) {
        res.send(user);
      }
      else {
        res.sendStatus(404);
      }
    });
});

module.exports = router;
