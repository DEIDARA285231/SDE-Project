import express from 'express';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import compression from 'compression';

import cors from 'cors';

import config from './config';
import routerTwitch from './routes';

const app = express();

app.use(errorHandler());     // Log stack trace of errors (to be used only on development phases!)
app.use(logger('dev'));                               // Log HTTP requests
app.use(compression());                               // Compress all responses
app.use(express.json());                           // Decode body responses
app.use(express.urlencoded());
app.use(cors());                                      // Enable Cross-Origin Resource Sharing

app.use('/api/twitch', routerTwitch);

app.listen(config.PORT, config.HOST);
console.log(`TWITCH running on http://${config.HOST}:${config.PORT}`);
