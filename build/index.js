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
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = __importDefault(require("./config"));
var routes_1 = __importDefault(require("./src/routes"));
var index = express_1.default();
var uri = "mongodb+srv://SDEUser1:sdeuser1@clustersde.8hbjn.mongodb.net/SDE_DB?retryWrites=true&w=majority";
mongoose_1.default.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () {
    console.log("MongoDB Connected…");
})
    .catch(function (err) { return console.log(err); });
mongoose_1.default.Promise = global.Promise;
index.use(express_1.default.static("public"));
// Log stack trace of errors (to be used only on development phases!)
index.use(errorhandler_1.default());
// Log HTTP requests
index.use(morgan_1.default('dev'));
// Compress all responses
index.use(compression_1.default());
// Decode body responses
index.use(body_parser_1.default.json());
index.use(body_parser_1.default.urlencoded({ extended: true }));
// Enable Cross-Origin Resource Sharing
index.use(cors_1.default());
// Uses router for all routes (we split the server logics and the routes definition)
index.use('/', routes_1.default);
// Start listening for requests! :)
index.listen(config_1.default.PORT, config_1.default.HOST);
console.log("API running on http://" + config_1.default.HOST + ":" + config_1.default.PORT);
