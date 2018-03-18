require("./../db.js");

const express = require('express');
const router = express.Router();

// /* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Otter', first: req.user.first});
});

router.get('/about', function(req, res, next) {
	res.render('about');
});

router.get('/addname', function(req, res, next) {
    res.render('addname', { title: 'Otter' });
});


// redirect to log in page if user is not logged in (ensures authentication)--> pair with app.get'/'
function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/addname')
    }
};

module.exports = router;