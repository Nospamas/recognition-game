var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('test2', { title: 'Screen Test 2' });
});

module.exports = router;
