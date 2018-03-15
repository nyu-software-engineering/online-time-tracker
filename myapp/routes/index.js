const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Otter' });
});

router.get('/about', function(req, res, next) {
	res.render('about');
});

module.exports = router;
