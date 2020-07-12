const express = require('express');                             // retrieves the package
const app = express();                                          // app is used to call express
//const mongoose = require('mongoose');                         //used to access mongoDB (future expansion)
const bodyParser = require('body-parser');                      //used to handle JSON files
const cors = require('cors');
require('dotenv/config');                                       //used to handle the .env file with the access keys
//import routes
app.use(bodyParser.json());
const emailRoute = require('./Routes/LEDScheme.js')             // the './' indicates it is in a subfolder
//middlewares
app.use(cors());
app.use('/email', emailRoute);                                  //preps for middleware emailLight
//route
app.get('/', (req, res) => {                                    //(req,res) = request and response
    res.send('Email\'s express is running..')
});
app.listen(9001)                                                //turning on the server and start listning to the server. the number is the port.
/*
//connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,                                  // process calls the file ".env", and pulls what DB_CONNECTION is equivalent to
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        },
    () => console.log('successfully accessed the database..')
);                                                              //feed-back signifying successful connection.
*/