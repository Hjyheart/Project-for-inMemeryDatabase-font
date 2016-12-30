var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
    console.log(req.query);
    var name = req.session.userId;
    console.log(name);
    req.session.userId = req.query.id;
    req.session.save();

    res.redirect('/');
});

module.exports = router;
