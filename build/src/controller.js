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
exports.gameSpeedrun = exports.videosTwitch = exports.streamsTwitch = exports.searchTwitch = exports.topGamesTwitch = exports.gameTwitch = exports.activePlayersSteam = exports.priceSteam = exports.platformsIGDB = exports.getStoreLow = exports.plainITAD = exports.releaseIGDB = exports.gameVideosIGDB = exports.topRatedIGDB = exports.externalGameIGDB = exports.coverIGDB = exports.artworkIGDB = exports.genresIGDB = exports.gameIGDB = void 0;
var types_1 = require("./types");
var core_1 = require("./core");
var helper_1 = require("./helper");
var ExternalDB = require('../models/Externals');
var axios_1 = __importDefault(require("axios"));
//IGDB
exports.gameIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nameGameInserted, gameInDB, game, i, responseGenre, game, i, responseGenre, err_1, gameID, game, i, responseGenre;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nameGameInserted = helper_1.getGameNameFromRequest(req);
                if (!(nameGameInserted !== false)) return [3 /*break*/, 21];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 19, , 20]);
                return [4 /*yield*/, ExternalDB.findOne({ gameName: nameGameInserted })];
            case 2:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 9];
                //c'è il gioco nel DB
                if (!types_1.isError(gameInDB)) {
                    res.contentType('json');
                }
                return [4 /*yield*/, core_1.getGameIGDBbyID(gameInDB.gameId)];
            case 3:
                game = _a.sent();
                if (!(game.genres !== undefined)) return [3 /*break*/, 8];
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < game.genres.length)) return [3 /*break*/, 7];
                return [4 /*yield*/, axios_1.default({
                        url: "http://localhost:3000/api/game/genres",
                        method: 'GET',
                        headers: {
                            "Accept": "application/json",
                        },
                        params: {
                            id: game.genres[i]
                        }
                    })];
            case 5:
                responseGenre = _a.sent();
                game.genres[i] = responseGenre.data["name"];
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                res.send(game);
                _a.label = 8;
            case 8:
                res.send(game);
                return [3 /*break*/, 18];
            case 9: return [4 /*yield*/, core_1.getGameIGDB(nameGameInserted)];
            case 10:
                game = _a.sent();
                if (!(game !== (undefined))) return [3 /*break*/, 17];
                return [4 /*yield*/, axios_1.default({
                        url: "http://localhost:3000/api/game/externalGame",
                        method: 'GET',
                        headers: {
                            "Accept": "application/json",
                        },
                        params: {
                            id: game.id
                        }
                    })];
            case 11:
                _a.sent();
                if (!(game.genres !== undefined)) return [3 /*break*/, 16];
                i = 0;
                _a.label = 12;
            case 12:
                if (!(i < game.genres.length)) return [3 /*break*/, 15];
                return [4 /*yield*/, axios_1.default({
                        url: "http://localhost:3000/api/game/genres",
                        method: 'GET',
                        headers: {
                            "Accept": "application/json",
                        },
                        params: {
                            id: game.genres[i]
                        }
                    })];
            case 13:
                responseGenre = _a.sent();
                game.genres[i] = responseGenre.data["name"];
                _a.label = 14;
            case 14:
                i++;
                return [3 /*break*/, 12];
            case 15:
                res.send(game);
                _a.label = 16;
            case 16: return [3 /*break*/, 18];
            case 17:
                res.status(404);
                res.send({ error: "Game not found" });
                _a.label = 18;
            case 18: return [3 /*break*/, 20];
            case 19:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 20];
            case 20: return [3 /*break*/, 29];
            case 21:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 28];
                return [4 /*yield*/, core_1.getGameIGDBbyID(gameID)];
            case 22:
                game = _a.sent();
                if (!types_1.isError(game)) {
                    res.contentType('json');
                }
                if (!(game.genres !== undefined)) return [3 /*break*/, 27];
                i = 0;
                _a.label = 23;
            case 23:
                if (!(i < game.genres.length)) return [3 /*break*/, 26];
                return [4 /*yield*/, axios_1.default({
                        url: "http://localhost:3000/api/game/genres",
                        method: 'GET',
                        headers: {
                            "Accept": "application/json",
                        },
                        params: {
                            id: game.genres[i]
                        }
                    })];
            case 24:
                responseGenre = _a.sent();
                game.genres[i] = responseGenre.data["name"];
                _a.label = 25;
            case 25:
                i++;
                return [3 /*break*/, 23];
            case 26:
                res.send(game);
                _a.label = 27;
            case 27:
                res.send(game);
                return [3 /*break*/, 29];
            case 28:
                res.status(400);
                res.send({ error: "Invalid name or ID format" });
                _a.label = 29;
            case 29: return [2 /*return*/];
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
                return [4 /*yield*/, core_1.itadGetPlain(newExternal.steamId)];
            case 2:
                responseItad = _a.sent();
                newExternal.itad_plain = responseItad["data"]["app/" + newExternal.steamId];
                _a.label = 3;
            case 3:
                if (indexGog !== -1) {
                    newExternal.gogId = externalIds[indexGog]["uid"];
                }
                return [4 /*yield*/, ExternalDB.create(newExternal)];
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
                return [4 /*yield*/, core_1.itadGetPlain(newExternal.steamId)];
            case 9:
                responseItad = _a.sent();
                newExternal.itad_plain = responseItad["data"]["app/" + newExternal.steamId];
                _a.label = 10;
            case 10:
                if (indexGog !== -1) {
                    newExternal.gogId = externalIds[indexGog]["uid"];
                }
                return [4 /*yield*/, ExternalDB.create(newExternal)];
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
    var topRated, entry, i, responseGenre;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, core_1.getTopRatedIGDB()];
            case 1:
                topRated = _a.sent();
                entry = 0;
                _a.label = 2;
            case 2:
                if (!(entry < topRated.length)) return [3 /*break*/, 7];
                if (!(topRated[entry].genres !== undefined)) return [3 /*break*/, 6];
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < topRated[entry].genres.length)) return [3 /*break*/, 6];
                return [4 /*yield*/, axios_1.default({
                        url: "http://localhost:3000/api/game/genres",
                        method: 'GET',
                        headers: {
                            "Accept": "application/json",
                        },
                        params: {
                            id: topRated[entry].genres[i]
                        }
                    })];
            case 4:
                responseGenre = _a.sent();
                topRated[entry].genres[i] = responseGenre.data["name"];
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                entry++;
                return [3 /*break*/, 2];
            case 7:
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
exports.plainITAD = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gameInDB, plain, response, responseExt, plain, response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 13];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, ExternalDB.findOne({ gameId: gameID })];
            case 2:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 6];
                //c'è il gioco nel DB
                if (!types_1.isError(gameInDB)) {
                    res.contentType('json');
                }
                if (!(gameInDB.steamId !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, core_1.itadGetPlain(gameInDB.steamId)];
            case 3:
                plain = _a.sent();
                response = {
                    id: gameID,
                    steamId: gameInDB.steamId,
                    plain: plain["data"]["app/" + gameID]
                };
                res.send(response);
                return [3 /*break*/, 5];
            case 4:
                res.status(404);
                res.send({ error: "Game not on IsThereAnyDeal.com" });
                _a.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, axios_1.default({
                    url: "http://localhost:3000/api/game/externalGame",
                    method: 'GET',
                    params: {
                        id: gameID
                    }
                })];
            case 7:
                responseExt = _a.sent();
                if (!(responseExt.data.steamId !== undefined)) return [3 /*break*/, 9];
                return [4 /*yield*/, core_1.itadGetPlain(responseExt.data.steamId)];
            case 8:
                plain = _a.sent();
                response = {
                    id: gameID,
                    steamId: gameInDB.steamId,
                    plain: plain["data"]["app/" + gameID]
                };
                res.send(response);
                return [3 /*break*/, 10];
            case 9:
                res.status(404);
                res.send({ error: "Game not on IsThereAnyDeal.com" });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_1 = _a.sent();
                res.status(400);
                res.send({ error: 'Invalid!' });
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.getStoreLow = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, storeSet, store, gameInDB, storeLow, response, responseExt, storeLow, response, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                storeSet = new Set(["amazonus", "origin", "epic", "steam", "gog"]);
                store = helper_1.getStringFromRequest(req, "store");
                store = (storeSet.has(String(store))) ? String(store) : "steam";
                if (!(gameID !== false)) return [3 /*break*/, 13];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, ExternalDB.findOne({ gameId: gameID })];
            case 2:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 6];
                if (!(gameInDB.itad_plain !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, core_1.itadStoreLow(gameInDB.itad_plain, store)];
            case 3:
                storeLow = _a.sent();
                if (storeLow["data"].length > 0) {
                    response = {
                        id: gameID,
                        plain: gameInDB.itad_plain,
                        store: store,
                        storeLowestPrice: storeLow["data"][gameInDB.itad_plain][0].price
                    };
                    res.send(response);
                }
                else {
                    res.status(404);
                    res.send({ error: "Store Low Not Found" });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(404);
                res.send({ error: "Game not on IsThereAnyDeal.com" });
                _a.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, axios_1.default({
                    url: "http://localhost:3000/api/game/externalGame",
                    method: 'GET',
                    params: {
                        id: gameID
                    }
                })];
            case 7:
                responseExt = _a.sent();
                if (!(responseExt.data.itad_plain !== undefined)) return [3 /*break*/, 9];
                return [4 /*yield*/, core_1.itadStoreLow(responseExt.data.itad_plain, store)];
            case 8:
                storeLow = _a.sent();
                if (storeLow["data"].length > 0) {
                    response = {
                        id: gameID,
                        plain: responseExt.data.itad_plain,
                        store: store,
                        storeLowestPrice: storeLow["data"][responseExt.data.itad_plain][0].price
                    };
                    res.send(response);
                }
                else {
                    res.status(404);
                    res.send({ error: "Store Low Not Found" });
                }
                return [3 /*break*/, 10];
            case 9:
                res.status(404);
                res.send({ error: "Game not on IsThereAnyDeal.com" });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_2 = _a.sent();
                res.status(400);
                res.send({ error: 'Invalid!' });
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 14;
            case 14: return [2 /*return*/];
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
//Steam
exports.priceSteam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var appID, gameInDB, steamPrice, response, responseExt, steamPrice, response, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appID = helper_1.getIdFromRequest(req);
                if (!(appID !== false)) return [3 /*break*/, 13];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, ExternalDB.findOne({ gameId: appID })];
            case 2:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 6];
                //c'è il gioco nel DB
                if (!types_1.isError(gameInDB)) {
                    res.contentType('json');
                }
                if (!(gameInDB.steamId !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, core_1.getPriceSteam(gameInDB.steamId)];
            case 3:
                steamPrice = _a.sent();
                response = {
                    id: appID,
                    game_name: gameInDB.gameName,
                    price: steamPrice[gameInDB.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"] / 100
                };
                res.send(response);
                return [3 /*break*/, 5];
            case 4:
                res.status(404);
                res.send({ error: "Game not on Steam" });
                _a.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, axios_1.default({
                    url: "http://localhost:3000/api/game/externalGame",
                    method: 'GET',
                    params: {
                        id: appID
                    }
                })];
            case 7:
                responseExt = _a.sent();
                if (!(responseExt.data.steamId !== undefined)) return [3 /*break*/, 9];
                return [4 /*yield*/, core_1.getPriceSteam(responseExt.data.steamId)];
            case 8:
                steamPrice = _a.sent();
                response = {
                    id: appID,
                    game_name: responseExt.data.gameName,
                    price: steamPrice[responseExt.data.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"] / 100
                };
                if (!types_1.isError(steamPrice)) {
                    res.contentType('json');
                }
                res.send(response);
                return [3 /*break*/, 10];
            case 9:
                res.status(404);
                res.send({ error: "Game not on Steam" });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_3 = _a.sent();
                res.status(400);
                res.send({ error: 'Invalid!' });
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(400);
                res.send({ error: 'Invalid parameter!' });
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.activePlayersSteam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var appID, gameInDB, steamPlayers, response, responseExt, steamPlayers, response, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appID = helper_1.getIdFromRequest(req);
                if (!(appID !== false)) return [3 /*break*/, 13];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, ExternalDB.findOne({ gameId: appID })];
            case 2:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 6];
                //c'è il gioco nel DB
                if (!types_1.isError(gameInDB)) {
                    res.contentType('json');
                }
                if (!(gameInDB.steamId !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, core_1.getActivePlayersSteam(gameInDB.steamId)];
            case 3:
                steamPlayers = _a.sent();
                response = {
                    id: appID,
                    game_name: gameInDB.gameName,
                    activePlayers: steamPlayers["response"]["player_count"]
                };
                res.send(response);
                return [3 /*break*/, 5];
            case 4:
                res.status(404);
                res.send({ error: "Game not on Steam" });
                _a.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, axios_1.default({
                    url: "http://localhost:3000/api/game/externalGame",
                    method: 'GET',
                    params: {
                        id: appID
                    }
                })];
            case 7:
                responseExt = _a.sent();
                if (!(responseExt.data.steamId !== undefined)) return [3 /*break*/, 9];
                return [4 /*yield*/, core_1.getActivePlayersSteam(responseExt.data.steamId)];
            case 8:
                steamPlayers = _a.sent();
                response = {
                    id: appID,
                    game_name: responseExt.data.gameName,
                    activePlayers: steamPlayers["response"]["player_count"]
                };
                if (!types_1.isError(steamPlayers)) {
                    res.contentType('json');
                }
                res.send(response);
                return [3 /*break*/, 10];
            case 9:
                res.status(404);
                res.send({ error: "Game not on Steam" });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_4 = _a.sent();
                res.status(400);
                res.send({ error: 'Invalid!' });
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(400);
                res.send({ error: 'Invalid parameter!' });
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); };
//Twitch
//Ok, already returns exactly id, name and box_art_url
exports.gameTwitch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gameName, gameInDB, game, responseExt, game, e_5, gameInDB, game, responseExt, game, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                gameName = helper_1.getGameNameFromRequest(req);
                if (!(gameID !== false && gameName !== false)) return [3 /*break*/, 1];
                res.status(400);
                res.send({ error: "Provide only game id OR game name" });
                return [3 /*break*/, 28];
            case 1:
                if (!(gameID !== false)) return [3 /*break*/, 14];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 12, , 13]);
                return [4 /*yield*/, ExternalDB.findOne({ gameId: gameID })];
            case 3:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 7];
                //c'è il gioco nel DB
                if (!types_1.isError(gameInDB)) {
                    res.contentType('json');
                }
                if (!(gameInDB.twitchId !== undefined)) return [3 /*break*/, 5];
                return [4 /*yield*/, core_1.getTwitchGameById(String(gameInDB.twitchId))];
            case 4:
                game = _a.sent();
                res.send(game);
                return [3 /*break*/, 6];
            case 5:
                res.status(404);
                res.send({ error: "Game not broadcasted on Twitch" });
                _a.label = 6;
            case 6: return [3 /*break*/, 11];
            case 7: return [4 /*yield*/, axios_1.default({
                    url: "http://localhost:3000/api/game/externalGame",
                    method: 'GET',
                    params: {
                        id: gameID
                    }
                })];
            case 8:
                responseExt = _a.sent();
                if (!(responseExt.data.twitchId !== undefined)) return [3 /*break*/, 10];
                return [4 /*yield*/, core_1.getTwitchGameById(String(responseExt.data.twitchId))];
            case 9:
                game = _a.sent();
                res.send(game);
                return [3 /*break*/, 11];
            case 10:
                res.status(404);
                res.send({ error: "Game not broadcasted on Twitch" });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                e_5 = _a.sent();
                res.status(400);
                res.send({ error: 'Invalid!' });
                return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 28];
            case 14:
                if (!(gameName !== false)) return [3 /*break*/, 27];
                _a.label = 15;
            case 15:
                _a.trys.push([15, 25, , 26]);
                return [4 /*yield*/, ExternalDB.findOne({ gameName: gameName })];
            case 16:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 20];
                if (!(gameInDB.twitchId !== undefined)) return [3 /*break*/, 18];
                return [4 /*yield*/, core_1.getTwitchGameById(String(gameInDB.twitchId))];
            case 17:
                game = _a.sent();
                res.send(game);
                return [3 /*break*/, 19];
            case 18:
                res.status(404);
                res.send({ error: "Game not broadcasted on Twitch" });
                _a.label = 19;
            case 19: return [3 /*break*/, 24];
            case 20: return [4 /*yield*/, axios_1.default({
                    url: "http://localhost:3000/api/game/externalGame",
                    method: 'GET',
                    params: {
                        name: gameName
                    }
                })];
            case 21:
                responseExt = _a.sent();
                if (!(responseExt.data.twitchId !== undefined)) return [3 /*break*/, 23];
                return [4 /*yield*/, core_1.getTwitchGameById(String(responseExt.data.twitchId))];
            case 22:
                game = _a.sent();
                res.send(game);
                return [3 /*break*/, 24];
            case 23:
                res.status(404);
                res.send({ error: "Game not broadcasted on Twitch" });
                _a.label = 24;
            case 24: return [3 /*break*/, 26];
            case 25:
                e_6 = _a.sent();
                res.status(400);
                res.send({ error: 'Invalid!' });
                return [3 /*break*/, 26];
            case 26: return [3 /*break*/, 28];
            case 27:
                res.status(400);
                res.send({ error: "Invalid parameter" });
                _a.label = 28;
            case 28: return [2 /*return*/];
        }
    });
}); };
//Ok, already returns exactly id, name and box_art_url
exports.topGamesTwitch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topGames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, core_1.getTopGamesTwitch()];
            case 1:
                topGames = _a.sent();
                res.send(topGames);
                return [2 /*return*/];
        }
    });
}); };
exports.searchTwitch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, searchedGames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = helper_1.getStringFromRequest(req, "query");
                if (!(query !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getSearchTwitch(query)];
            case 1:
                searchedGames = _a.sent();
                if (!types_1.isError(searchedGames)) {
                    res.contentType("json");
                }
                res.send(searchedGames);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid parameter" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.streamsTwitch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gameInDB, streams, responseExt, streams, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 13];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, ExternalDB.findOne({ gameId: gameID })];
            case 2:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 6];
                //c'è il gioco nel DB
                if (!types_1.isError(gameInDB)) {
                    res.contentType('json');
                }
                if (!(gameInDB.twitchId !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, core_1.getStreamsTwitch(String(gameInDB.twitchId))];
            case 3:
                streams = _a.sent();
                res.send(streams);
                return [3 /*break*/, 5];
            case 4:
                res.status(404);
                res.send({ error: "Game not broadcasted on Twitch" });
                _a.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, axios_1.default({
                    url: "http://localhost:3000/api/game/externalGame",
                    method: 'GET',
                    params: {
                        id: gameID
                    }
                })];
            case 7:
                responseExt = _a.sent();
                if (!(responseExt.data.twitchId !== undefined)) return [3 /*break*/, 9];
                return [4 /*yield*/, core_1.getStreamsTwitch(String(responseExt.data.twitchId))];
            case 8:
                streams = _a.sent();
                res.send(streams);
                return [3 /*break*/, 10];
            case 9:
                res.status(404);
                res.send({ error: "Game not broadcasted on Twitch" });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_7 = _a.sent();
                res.status(400);
                res.send({ error: 'Invalid!' });
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.videosTwitch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, periodSet, period, sortSet, sort, typeSet, type, gameInDB, _a, _b, responseExt, _c, _d, e_8;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                periodSet = new Set(["all", "day", "week", "month"]);
                period = helper_1.getStringFromRequest(req, "period");
                period = (periodSet.has(String(period))) ? String(period) : "month";
                sortSet = new Set(["time", "views"]);
                sort = helper_1.getStringFromRequest(req, "sort");
                sort = (sortSet.has(String(sort))) ? String(sort) : "views";
                typeSet = new Set(["all", "upload", "archive", "highlight"]);
                type = helper_1.getStringFromRequest(req, "type");
                type = (typeSet.has(String(type))) ? String(type) : "all";
                if (!(gameID !== false)) return [3 /*break*/, 13];
                _e.label = 1;
            case 1:
                _e.trys.push([1, 11, , 12]);
                return [4 /*yield*/, ExternalDB.findOne({ gameId: gameID })];
            case 2:
                gameInDB = _e.sent();
                if (!gameInDB) return [3 /*break*/, 6];
                //c'è il gioco nel DB
                if (!types_1.isError(gameInDB)) {
                    res.contentType('json');
                }
                if (!(gameInDB.twitchId !== undefined)) return [3 /*break*/, 4];
                _b = (_a = res).send;
                return [4 /*yield*/, core_1.getVideosTwitch(String(gameInDB.twitchId), period, sort, type)];
            case 3:
                _b.apply(_a, [_e.sent()]);
                return [3 /*break*/, 5];
            case 4:
                res.status(404);
                res.send({ error: "Game not broadcasted on Twitch" });
                _e.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, axios_1.default({
                    url: "http://localhost:3000/api/game/externalGame",
                    method: 'GET',
                    params: {
                        id: gameID
                    }
                })];
            case 7:
                responseExt = _e.sent();
                if (!(responseExt.data.twitchId !== undefined)) return [3 /*break*/, 9];
                _d = (_c = res).send;
                return [4 /*yield*/, core_1.getVideosTwitch(String(responseExt.data.twitchId), period, sort, type)];
            case 8:
                _d.apply(_c, [_e.sent()]);
                return [3 /*break*/, 10];
            case 9:
                res.status(404);
                res.send({ error: "Game not broadcasted on Twitch" });
                _e.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_8 = _e.sent();
                res.status(400);
                res.send({ error: 'Error!' });
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(400);
                res.send({ error: "Invalid parameter" });
                _e.label = 14;
            case 14: return [2 /*return*/];
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
