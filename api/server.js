const mongoose = require('mongoose')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const API_PORT = 3001
const app = express()
const config = require('../config/keys')

//Controllers
const AuthController = require('./controllers/AuthController')
const ProjectController = require('./controllers/ProjectController')

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(cors());

// connects our back end code with the database
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

let db = mongoose.connection;

db.once('open', () => console.log('MongoDB connected'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// append /api for our http requests
app.use('/api/authController', AuthController);
app.use('/api/projectController', ProjectController);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

io.on('connection', (socket) => {
    console.log('new client connected');
    socket.emit('connection', null);
});