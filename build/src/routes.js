"use strict";
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
/**
 * @route GET /games - Returns IGDB's infos for a certain game
 * @group IGDB - Endpoints regarding the IGDB platform
 * @param {BigInteger} id.query - ID of the game we need to search
 * @param {String} name.query - Name of the game we need to search, can also be a partial string
 * @param {BigInteger} limit.query - Number of results to keep, given the name
 * @param {BigInteger} offset.query - Number of results to skip, given the name
 * @returns {object} 200 - Returns a json containing the infos for a certain game on the IGDB Platform if id is provided, multiple games if name is provided.
 * @returns {object} 400 - Numerical id or name param is needed.
 * @returns {object} 404 - No Games with the name found.
 */
router.get("/games", controller_1.gameIGDB);
/**
 * @route GET /game/genres - Returns IGDB's genre infos corresponding to a certain ID
 * @group IGDB - Endpoints regarding the IGDB platform
 * @param {BigInteger} id.query - ID of the genre we need to search
 * @returns {object} 200 - Returns a json containing the corresponding infos for a genre given certain ID.
 * @returns {object} 400 - Invalid genre.
 * @returns {object} 404 - Genre with id not found.
 */
router.get("/game/genres", controller_1.genresIGDB);
/**
 * @route GET /game/artworks - Returns IGDB's artwork URL for a certain game
 * @group IGDB - Endpoints regarding the IGDB platform
 * @param {BigInteger} id.query - ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the infos regarding the artwork for a certain game on the IGDB Platform.
 * @returns {object} 503 - Something bad happened. Error from IGDB itself.
 * @returns {object} 400 - Invalid ID.
 * @returns {object} 404 - No Artwork was found.
 */
router.get("/game/artworks", controller_1.artworkIGDB);
/**
 * @route GET /game/covers - Returns IGDB's cover URL for a certain game
 * @group IGDB - Endpoints regarding the IGDB platform
 * @param {BigInteger} id.query - ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the infos regarding the cover art for a certain game on the IGDB Platform.
 * @returns {object} 400 - Invalid ID.
 * @returns {object} 404 - No Cover was found.
 * @returns {object} 503 - Something bad happened. Error from IGDB itself.
 */
router.get("/game/covers", controller_1.coverIGDB);
/**
 * @route GET /game/externalGame - Returns other platform's ID for a certain game
 * @group IGDB - Endpoints regarding the IGDB platform
 * @param {BigInteger} id.query - ID of the game we need to search
 * @returns {object} 200 - Returns a json containing all the IDs regarding a certain game on the IGDB Platform.
 * @returns {object} 204 - No external resources were found for the specified game.
 * @returns {object} 400 - No parameters specified. Numerical id or name is needed.
 * @returns {object} 404 - The game does not appear on any external platform.
 */
router.get("/game/externalGame", controller_1.externalGameIGDB); //TO DO
/**
 * @route GET /games/topRated - Returns top rated games according to IGDB
 * @group IGDB - Endpoints regarding the IGDB platform
 * @returns {object} 200 - Returns a json containing the top rated games.
 * @returns {object} 503 - Something bad happened. Error from IGDB itself.
 */
router.get("/games/topRated", controller_1.topRatedIGDB);
/**
 * @route GET /game/gameVideos - Returns IGDB's videos URL for a certain game
 * @group IGDB - Endpoints regarding the IGDB platform
 * @param {BigInteger} id.query - ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the infos (URLs) regarding a certain game on the IGDB Platform.
 * @returns {object} 400 - Invalid ID.
 * @returns {object} 404 - No video was found.
 * @returns {object} 503 - Something bad happened. Error from IGDB itself.
 */
router.get("/game/videos", controller_1.gameVideosIGDB);
/**
 * @route GET /game/platforms - Returns IGDB's infos on a certain hardware given its ID
 * @group IGDB - Endpoints regarding the IGDB platform
 * @param {BigInteger} id.query - ID of the hardware we need to search
 * @returns {object} 200 - Returns a json containing the list of hardwares able to run a certain game.
 * @returns {object} 400 - Invalid ID.
 * @returns {object} 404 - No platform found.
 * @returns {object} 503 - Something bad happened. Error from IGDB itself.
 */
router.get("/game/platforms", controller_1.platformsIGDB);
//speedrun
router.get('/speedrun', controller_1.gameSpeedrun); //search game(s) by param id or name
router.get('/howlongtobeat', controller_1.howLongToBeat);
exports.default = router;
