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
//IGDB
router.get("/games", controller_1.gameIGDB); //OK
router.get("/game/genres", controller_1.genresIGDB); //OK
router.get("/game/artworks", controller_1.artworkIGDB); //OK
router.get("/game/covers", controller_1.coverIGDB); //OK
router.get("/game/externalGame", controller_1.externalGameIGDB); //OK
router.get("/games/topRated", controller_1.topRatedIGDB); //OK
router.get("/game/gameVideos", controller_1.gameVideosIGDB); //OK
router.get("/game/platforms", controller_1.platformsIGDB); //OK
//speedrun
router.get('/speedrun', controller_1.gameSpeedrun); //search game(s) by param id or name
exports.default = router;
