"use strict";
/*********
 * Route definitions
 *   All the routes that you want to implement should be defined here!
 *   You should avoid to put code here: it's a better approach to call
 *   methods from the controllers in order to process the requests!
 *   In this way, here you can have a more organized way to check all
 *   your routes!
 *   In a huge project, you can define multiple routers in order to divide
 *   the endpoints in different files by the domain of their operation.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var controller_1 = require("./controller");
var router = express_1.default.Router();
// Possible methods: .get, .post, .put, .patch, .delete
// To add URL parameters (Doable for any method! Not only for GET):
// router.get('/:parameter1/:parameter2', f);
//IGDB
router.get("/games", controller_1.gameIGDB); //param name
router.get("/game/genres", controller_1.genresIGDB);
router.get("/game/artworks", controller_1.artworkIGDB);
router.get("/game/covers", controller_1.coverIGDB);
router.get("/game/externalGame", controller_1.externalGameIGDB);
router.get("/games/topRated", controller_1.topRatedIGDB);
router.get("/game/gameVideos", controller_1.gameVideosIGDB);
router.get("/game/releaseDates", controller_1.releaseIGDB);
router.get("/game/platforms", controller_1.platformsIGDB);
router.get("/game/name", controller_1.gameNameIGDB);
//STEAM
router.get('/steam/price', controller_1.priceSteam);
router.get('/steam/activePlayers', controller_1.activePlayersSteam);
//ITAD
router.get('/itad/getPlain', controller_1.plainITAD);
router.get('/itad/getStoreLow', controller_1.getStoreLow);
//TWITCH
router.get('/twitch', controller_1.gameTwitch); //search game by param id or name
router.get('/twitch/topGames', controller_1.topGamesTwitch); //default only 20 results
router.get('/twitch/search/', controller_1.searchTwitch); //search categories by param query
router.get('/twitch/streams/', controller_1.streamsTwitch); //search streams, either top overall or by (game)id param
router.get('/twitch/videos/', controller_1.videosTwitch); //search videos, either top overall or by (game)id param
//speedrun
router.get('/speedrun', controller_1.gameSpeedrun); //search game(s) by param id or name
exports.default = router;
