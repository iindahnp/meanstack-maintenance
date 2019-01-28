var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); 
var config = require('./config'); 

var user = require('./routes/user.js');
var main = require('./routes/main.js');
var repair = require('./routes/repair.js');


var port = process.env.PORT || config.serverport;

mongoose.connect(config.database, function(err){
	if(err){
		console.log('Error connecting database, please check if MongoDB is running.');
	}else{
		console.log('Connected to database...');
	}
}); 

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('body-parser').json({ type : '*/*' }));

// use morgan to log requests to the console
app.use(morgan('dev'));

// Enable CORS from client-side
app.use(function(req, res, next) {  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// basic routes

app.get('/', function(req, res) {
	res.send('Maintenance API is running at http://localhost:' + port + '/api');
});

app.post('/register', user.signup);

// express router
var apiRoutes = express.Router();

app.use('/api', apiRoutes);

apiRoutes.post('/login', user.login);

apiRoutes.use(user.authenticate); // route middleware to authenticate and check token

// authenticated routes
apiRoutes.get('/', function(req, res) {
	res.status(201).json({ message: 'Welcome to the authenticated routes!' });
});

apiRoutes.get('/user/:id', user.getuserDetails); // API returns user details 

apiRoutes.put('/user/:id', user.updateUser); // API updates user details

apiRoutes.put('/password/:id', user.updatePassword); // API updates user password

apiRoutes.post('/main/:id', main.savemain); // API adds & update maintenance of the user

apiRoutes.post('/repair/:id', repair.saverepair) 

apiRoutes.delete('/main/:id', main.delmain); //API removes the maintenance details of given maintenance id

apiRoutes.delete('/repair/:id', repair.delrepair)

apiRoutes.get('/main/:id', main.getmain); // API returns maintenance details of given maintenance id

apiRoutes.get('/repair/:id', repair.getrepair)

apiRoutes.post('/main/total/:id', main.maintotal); // API returns maintenance details of given maintenance id

apiRoutes.post('/main/report/:id', main.mainreport); //API returns maintenance report based on user input

// kick off the server 
app.listen(port);
console.log('Maintenance app is listening at http://localhost:' + port);
