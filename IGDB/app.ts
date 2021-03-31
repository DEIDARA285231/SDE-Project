import express from 'express';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import compression from 'compression';
import cors from 'cors';
import config from './config';
import router from './routes';

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:8082',
        basePath: '/api/igdb',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./routes.js'] //Path to the API handle folder
};
expressSwagger(options)

app.use(errorHandler());        // Log stack trace of errors (to be used only on development phases!)
app.use(logger('dev'));         // Log HTTP requests
app.use(compression());         // Compress all responses
app.use(express.json());        // Decode body responses
app.use(express.urlencoded());
app.use(cors());                // Enable Cross-Origin Resource Sharing

app.use('/api/igdb', router);

app.listen(config.PORT, config.HOST);
console.log(`IGDB running on http://http://172.16.238.20:8082`);
