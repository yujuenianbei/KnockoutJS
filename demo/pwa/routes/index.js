var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Service Worker Sample: Offline Page Not Dependent On Install' });
});

module.exports = router;
