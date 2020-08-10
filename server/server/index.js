const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const consoleLogger = require('./log/consoleLogger');
const port = process.env.PORT || 3000;
const cors = require('cors');

//add parser for http body access
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); //Enables Requests from other servers
//import mongoose for db
const mongoose = require('mongoose');
//suppress stacked findAndModify deprication warning
mongoose.set('useFindAndModify', false);
//create indexes to avoid deprication warning
mongoose.set('useCreateIndex', true);
//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/cofind_test';
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


/**
 * apply router for REST requests
 * referes to ./routes/index.routes.js
 */
const routes = require('./routes/index.routes');
app.use('/', routes);


//load the socket-handler module and will attach the connection listeners
require('./handler/socket.handler')(io);

/**
 * open port for HTTP requests
 */
http.listen(port, function () {
    console.log('listening on *:' + port);
});

/**
 * manage config
 */
const ConfigController = require('./controller/configController');
ConfigController.runSetup(function(res, msg){
    console.log("res: "+ res +" "+msg);
});


module.exports = app;