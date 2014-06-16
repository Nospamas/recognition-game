var express = require('express');
var router = express.Router();

/* GET admin page. */
router.get('/', function(req, res) {
    res.render('screen', { title: 'Screen' });
});

module.exports = router;
