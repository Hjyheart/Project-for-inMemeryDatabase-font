var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var id;
    if (req.session.userId === undefined){
        id = false;
    }else{
        id = req.session.userId;
    }

    res.render('index', {state : id});
});

router.post('/login', function (req, res, next) {
    console.log(req.query);
    var name = req.session.userId;
    console.log(name);
    req.session.userId = req.query.id;
    req.session.save();

    res.send('true');
});

router.get('/logout', function (req, res, next) {
    console.log(req);
    delete req.session.userId;
    res.send('true');
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
