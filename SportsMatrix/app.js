var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphb = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sportxmatrix');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

//init app
var app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphb({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//Bodyparser Middlware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//epxress session
app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave:true
}));

//Passpot init
app.use(passport.initialize());
app.use(passport.session());

//express validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam +='[' + namespace.shift()+']';
		}
		return{
			param : formParam,
			msg : msg,
			value: value
		};
	}
}));

//connect flash
app.use(flash());

//global variables
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	req.locals.error = req.flash('error');
	next();
});

app.use('/', routes);
app.use('/users', users);

//set ports
app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port ' +app.get('port'));
});