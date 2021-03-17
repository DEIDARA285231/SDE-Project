import express from 'express';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import compression from 'compression';
import cors from 'cors';

import config from './config/config';
import routerDB from './routes';
import { connect } from './config/db';

const app = express();

//connect to DB
connect()

app.use(errorHandler());     // Log stack trace of errors (to be used only on development phases!)
app.use(logger('dev'));                               // Log HTTP requests
app.use(compression());                               // Compress all responses
app.use(express.json());                           // Decode body responses
app.use(express.urlencoded());
app.use(cors());                                      // Enable Cross-Origin Resource Sharing

app.use('/api/db', routerDB);

app.listen(config.PORT, config.HOST);
console.log(`DB Adapter running on http://${config.HOST}:${config.PORT}`);
