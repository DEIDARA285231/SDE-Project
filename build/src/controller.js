"use strict";
/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 *   In a huge project, you should have multiple controllers, divided
 *   by the domain of the operation.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSpeedrun = exports.platformsIGDB = exports.releaseIGDB = exports.gameVideosIGDB = exports.topRatedIGDB = exports.externalGameIGDB = exports.coverIGDB = exports.artworkIGDB = exports.genresIGDB = exports.gameIGDB = void 0;
var types_1 = require("./types");
var core_1 = require("./core");
var core_2 = require("./itad/core");
var helper_1 = require("./helper");
var Externals_1 = __importDefault(require("../models/Externals"));
var axios_1 = __importDefault(require("axios"));
//IGDB
exports.gameIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nameGameInserted, gameInDB, game, genreStructure, i, games, genreStructure, i, j, err_1, gameID, gameInDB, game, genreStructure, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nameGameInserted = helper_1.getGameNameFromRequest(req);
                if (!(nameGameInserted !== false)) return [3 /*break*/, 9];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, Externals_1.default.findOne({ gameName: nameGameInserted })];
            case 2:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 4];
                return [4 /*yield*/, core_1.getGameIGDBbyID(gameInDB.gameId)];
            case 3:
                game = _a.sent();
                if (!types_1.isError(game)) {
                    if (game.genres !== undefined) {
                        genreStructure = helper_1.getGenres();
                        for (i = 0; i < game.genres.length; i++) {
                            game.genres[i] = genreStructure[game.genres[i]].name;
                        }
                        res.send(game);
                    }
                    else {
                        res.send(game);
                    }
                }
                else {
                    res.status(400);
                    res.send({ error: "Error" });
                }
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, core_1.getGameIGDB(nameGameInserted)];
            case 5:
                games = _a.sent();
                if (!types_1.isError(games) && games !== (undefined)) {
                    genreStructure = helper_1.getGenres();
                    for (i = 0; i < games.length; i++) {
                        /*await axios({
                          url: "http://localhost:3000/api/game/externalGame",
                          method: 'GET',
                          headers: {
                            "Accept": "application/json",
                          },
                          params: {
                            id: games[i].id
                          }
                        });*/
                        if (games[i].genres !== undefined) {
                            for (j = 0; j < games[i].genres.length; j++) {
                                games[i].genres[j] = genreStructure[games[i].genres[j]].name;
                            }
                        }
                    }
                    res.send(games);
                }
                else {
                    res.status(404);
                    res.send({ error: "No Games found" });
                }
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 15];
            case 9:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 14];
                return [4 /*yield*/, Externals_1.default.findOne({ gameId: gameID })];
            case 10:
                gameInDB = _a.sent();
                if (!!(gameInDB)) return [3 /*break*/, 12];
                return [4 /*yield*/, axios_1.default({
                        url: "http://localhost:3000/api/game/externalGame",
                        method: 'GET',
                        headers: {
                            "Accept": "application/json",
                        },
                        params: {
                            id: gameID
                        }
                    })];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12: return [4 /*yield*/, core_1.getGameIGDBbyID(gameID)];
            case 13:
                game = _a.sent();
                if (!types_1.isError(game)) {
                    if (game.genres !== undefined) {
                        genreStructure = helper_1.getGenres();
                        for (i = 0; i < game.genres.length; i++) {
                            game.genres[i] = genreStructure[game.genres[i]].name;
                        }
                        res.send(game);
                    }
                    else {
                        res.send(game);
                    }
                }
                return [3 /*break*/, 15];
            case 14:
                res.status(400);
                res.send({ error: "Invalid name or ID format" });
                _a.label = 15;
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.genresIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var genreID, genre;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                genreID = helper_1.getIdFromRequest(req);
                if (!(genreID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getGenreFromIdIGDB(genreID)];
            case 1:
                genre = _a.sent();
                if (!types_1.isError(genre)) {
                    res.contentType("json");
                }
                res.send(genre);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid genre" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.artworkIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gameArtwork;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getArtworkIGDB(gameID)];
            case 1:
                gameArtwork = _a.sent();
                if (!types_1.isError(gameArtwork)) {
                    res.contentType("json");
                }
                res.send(gameArtwork);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.coverIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gameCover;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getCoverIGDB(gameID)];
            case 1:
                gameCover = _a.sent();
                if (!types_1.isError(gameCover)) {
                    res.contentType("json");
                }
                res.send(gameCover);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.externalGameIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, name, externalIds, indexTwitch, indexSteam, indexGog, i, newExternal, responseItad, externalIds, indexTwitch, indexSteam, indexGog, i, newExternal, responseItad;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                name = helper_1.getGameNameFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 7];
                return [4 /*yield*/, core_1.getExternalsIGDB(gameID)];
            case 1:
                externalIds = _a.sent();
                indexTwitch = -1, indexSteam = -1, indexGog = -1;
                if (!(externalIds.length > 0)) return [3 /*break*/, 5];
                for (i = 0; i < externalIds.length; i++) {
                    if (externalIds[i].category === 14) {
                        indexTwitch = i;
                    }
                    else if (externalIds[i].category === 1) {
                        indexSteam = i;
                    }
                    else if (externalIds[i].category === 5) {
                        indexGog = i;
                    }
                }
                newExternal = {
                    gameName: externalIds[indexTwitch]["name"],
                    gameId: gameID,
                    twitchId: externalIds[indexTwitch]["uid"]
                };
                if (!(indexSteam !== -1)) return [3 /*break*/, 3];
                newExternal.steamId = externalIds[indexSteam]["uid"];
                if (!(newExternal.steamId !== undefined)) return [3 /*break*/, 3];
                return [4 /*yield*/, core_2.itadGetPlain(newExternal.steamId)];
            case 2:
                responseItad = _a.sent();
                newExternal.itad_plain = responseItad["data"]["app/" + newExternal.steamId];
                _a.label = 3;
            case 3:
                if (indexGog !== -1) {
                    newExternal.gogId = externalIds[indexGog]["uid"];
                }
                return [4 /*yield*/, Externals_1.default.create(newExternal)];
            case 4:
                _a.sent();
                res.send(newExternal);
                return [3 /*break*/, 6];
            case 5:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 6;
            case 6: return [3 /*break*/, 15];
            case 7:
                if (!(name !== false)) return [3 /*break*/, 14];
                return [4 /*yield*/, core_1.getExternalsIGDBbyName(name)];
            case 8:
                externalIds = _a.sent();
                indexTwitch = -1, indexSteam = -1, indexGog = -1;
                if (!(externalIds.length > 0)) return [3 /*break*/, 12];
                for (i = 0; i < externalIds.length; i++) {
                    if (externalIds[i].category === 14) {
                        indexTwitch = i;
                    }
                    else if (externalIds[i].category === 1) {
                        indexSteam = i;
                    }
                    else if (externalIds[i].category === 5) {
                        indexGog = i;
                    }
                }
                newExternal = {
                    gameName: name,
                    gameId: externalIds[indexTwitch]["game"],
                    twitchId: externalIds[indexTwitch]["uid"]
                };
                if (!(indexSteam !== -1)) return [3 /*break*/, 10];
                newExternal.steamId = externalIds[indexSteam]["uid"];
                if (!(newExternal.steamId !== undefined)) return [3 /*break*/, 10];
                return [4 /*yield*/, core_2.itadGetPlain(newExternal.steamId)];
            case 9:
                responseItad = _a.sent();
                newExternal.itad_plain = responseItad["data"]["app/" + newExternal.steamId];
                _a.label = 10;
            case 10:
                if (indexGog !== -1) {
                    newExternal.gogId = externalIds[indexGog]["uid"];
                }
                return [4 /*yield*/, Externals_1.default.create(newExternal)];
            case 11:
                _a.sent();
                res.send(newExternal);
                return [3 /*break*/, 13];
            case 12:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 15;
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.topRatedIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topRated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, core_1.getTopRatedIGDB()];
            case 1:
                topRated = _a.sent();
                if (!types_1.isError(topRated)) {
                    res.contentType("json");
                }
                res.send(topRated);
                return [2 /*return*/];
        }
    });
}); };
exports.gameVideosIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gameVideos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getGameVideosIGDB(gameID)];
            case 1:
                gameVideos = _a.sent();
                if (!types_1.isError(gameVideos)) {
                    res.contentType('json'); //Need a way to use mp4
                }
                res.send(gameVideos);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.releaseIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gameReleases;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getGameReleasesIGDB(gameID)];
            case 1:
                gameReleases = _a.sent();
                if (!types_1.isError(gameReleases)) {
                    res.contentType("json");
                }
                res.send(gameReleases);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.platformsIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gamePlatforms;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getGamePlatformsIGDB(gameID)];
            case 1:
                gamePlatforms = _a.sent();
                if (!types_1.isError(gamePlatforms)) {
                    res.contentType("json");
                }
                res.send(gamePlatforms);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.gameSpeedrun = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                gameID = helper_1.getStringFromRequest(req, "name");
                if (!(gameID !== false)) return [3 /*break*/, 2];
                //const videos = await getVideosTwitch(gameID);
                _b = (_a = res).send;
                return [4 /*yield*/, core_1.getSpeedrunGameByName(gameID)];
            case 1:
                //const videos = await getVideosTwitch(gameID);
                _b.apply(_a, [_c.sent()]);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid parameter" });
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
