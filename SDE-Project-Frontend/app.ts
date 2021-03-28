import express from 'express';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import compression from 'compression';
import cors from 'cors';
import exphbs from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import session from 'express-session';

import mongoose from 'mongoose';
//const MongoStore = require('connect-mongo')(session)
const MongoDBStore = require('connect-mongodb-session')(session)

//import { connect } from '../SDE-Project-DB/config/db';
import config from './config/config';

require('./config/passport')(passport)

//connect()

const store = new MongoDBStore({
  uri: 'mongodb+srv://SDEUser1:sdeuser1@clustersde.8hbjn.mongodb.net/SDE_DB?retryWrites=true&w=majority',
  collection: 'sessions'
})

const app = express();

app.use(errorHandler());     // Log stack trace of errors (to be used only on development phases!)
app.use(logger('dev'));                               // Log HTTP requests
app.use(compression());                               // Compress all responses
app.use(express.json());                           // Decode body responses
app.use(express.urlencoded());
app.use(cors());                                      // Enable Cross-Origin Resource Sharing

//Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions
/*app.use(session({
  secret: 'keyboard cat',
  resave: false,  //don't save session if nothing is modified
  saveUninitialized: false,  //don't create session until something stored
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))*/

app.use(session({
  secret: 'secret token',
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  store: store,
  name: 'session cookie name',
  genid: (req) => {
    //returns a random string
    return Math.random().toString(36).substring(7);
  }
}));

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))

app.listen(config.PORT, config.HOST);
console.log(`Frontend running on http://http://172.16.238.60:8086`);
