var express = require('express');
var router = express.Router();

//get register
router.get('/register', function(req, res){
	res.render('register');
});

//get login
router.get('/login', function(req, res){
	res.render('login');
});

module.exports = router;