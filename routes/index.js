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

router.get('/logout', function (req, res, next) {
    console.log(req.query);
    delete req.session.userId;
    res.redirect('/');
});

/* GET myCenter page */
router.get('/mycenter', function (req, res, next) {
    var id;
    if (req.session.userId === undefined){
        id = false;
    }else{
        id = req.session.userId;
    }

    res.render('mycenter', {state : id});
});

module.exports = router;
