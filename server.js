const express= require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Setup for Database connection
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {

    console.log('Connected to database '+ config.database);
});
mongoose.connection.on('error', (err) => {

    console.log('Database Error: '+ err);
})

const app = express();

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Port
var port = process.env.PORT || 3000;

//Middleware for Routes
const users = require('./routes/users');

//Cors Middleware
app.use(cors());

//BodyParser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Routes
app.use('/users', users);

app.get('/',(req,res) => {

    res.send('Invalid Endpoint');
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

//Start Server
app.listen(port, function(){
    console.log('Server is listening on port '+port);
})