require("./../db.js");

var express = require('express');
var router = express.Router();

router.get('/addname', function(req, res, next) {
  res.render('addname', { title: 'Otter' });
});

module.exports = router;
