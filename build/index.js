"use strict";
/*********
 * Index of the service
 *   Here we configure all the stuff that belongs to the service
 *   in general, such as global middlewares, libs initializations
 *   (if needed), etc.
 *   The code written in here is executed just once!
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var errorhandler_1 = __importDefault(require("errorhandler"));
var morgan_1 = __importDefault(require("morgan"));
var compression_1 = __importDefault(require("compression"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var db_1 = require("./config/db");
var config_1 = __importDefault(require("./config/config"));
var routes_1 = __importDefault(require("./src/routes"));
db_1.connect();
var app = express_1.default();
app.use(express_1.default.static("public"));
// Log stack trace of errors (to be used only on development phases!)
app.use(errorhandler_1.default());
// Log HTTP requests
app.use(morgan_1.default('dev'));
// Compress all responses
app.use(compression_1.default());
// Decode body responses
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Enable Cross-Origin Resource Sharing
app.use(cors_1.default());
app.engine('.hbs', express_handlebars_1.default({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
// Uses router for all routes (we split the server logics and the routes definition)
app.use('/', routes_1.default);
// Start listening for requests! :)
app.listen(config_1.default.PORT, config_1.default.HOST);
console.log("API running on http://" + config_1.default.HOST + ":" + config_1.default.PORT);
