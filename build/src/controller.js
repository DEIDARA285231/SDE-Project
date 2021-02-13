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
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSpeedrun = exports.videosTwitch = exports.streamsTwitch = exports.searchTwitch = exports.topGamesTwitch = exports.gameTwitch = exports.activePlayersSteam = exports.priceSteam = exports.platformsIGDB = exports.getStoreLow = exports.plainITAD = exports.releaseIGDB = exports.gameVideosIGDB = exports.topRatedIGDB = exports.externalGameIGDB = exports.coverIGDB = exports.artworkIGDB = exports.genresIGDB = exports.gameIGDB = void 0;
var types_1 = require("./types");
var core_1 = require("./core");
var helper_1 = require("./helper");
var ExternalDB = require('../models/Externals');
//IGDB
exports.gameIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nameGameInserted, gameInDB, game, game, externalIds, indexTwitch, indexSteam, indexGog, i, newExternal, responseItad, err_1, gameID, game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nameGameInserted = helper_1.getGameNameFromRequest(req);
                if (!(nameGameInserted !== false)) return [3 /*break*/, 14];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 12, , 13]);
                return [4 /*yield*/, ExternalDB.findOne({ gameName: nameGameInserted })];
            case 2:
                gameInDB = _a.sent();
                if (!gameInDB) return [3 /*break*/, 4];
                //c'è il gioco nel DB
                if (!types_1.isError(gameInDB)) {
                    res.contentType('json');
                }
                return [4 /*yield*/, core_1.getGameIGDBbyID(gameInDB.gameId)];
            case 3:
                game = _a.sent();
                res.send(game);
                return [3 /*break*/, 11];
            case 4: return [4 /*yield*/, core_1.getGameIGDB(nameGameInserted)];
            case 5:
                game = _a.sent();
                if (!(game !== (undefined))) return [3 /*break*/, 10];
                return [4 /*yield*/, core_1.getExternalsIGDB(game.id)];
            case 6:
                externalIds = _a.sent();
                indexTwitch = -1, indexSteam = -1, indexGog = -1;
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
                    gameName: game.name,
                    gameId: game.id,
                    twitchId: externalIds[indexTwitch]["uid"]
                };
                if (!(indexSteam !== -1)) return [3 /*break*/, 8];
                newExternal.steamId = externalIds[indexSteam]["uid"];
                if (!(newExternal.steamId !== undefined)) return [3 /*break*/, 8];
                return [4 /*yield*/, core_1.itadGetPlain(newExternal.steamId)];
            case 7:
                responseItad = _a.sent();
                newExternal.itad_plain = responseItad["data"]["app/" + newExternal.steamId];
                _a.label = 8;
            case 8:
                if (indexGog !== -1) {
                    newExternal.gogId = externalIds[indexGog]["uid"];
                }
                return [4 /*yield*/, ExternalDB.create(newExternal)];
            case 9:
                _a.sent();
                res.send(game);
                return [3 /*break*/, 11];
            case 10:
                res.status(404);
                res.send({ error: "Game not found" });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 17];
            case 14:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 16];
                return [4 /*yield*/, core_1.getGameIGDBbyID(gameID)];
            case 15:
                game = _a.sent();
                if (!types_1.isError(game)) {
                    res.contentType('json');
                }
                res.send(game);
                return [3 /*break*/, 17];
            case 16:
                res.status(400);
                res.send({ error: "Invalid name or ID format" });
                _a.label = 17;
            case 17: return [2 /*return*/];
        }
    });
}); };
exports.genresIGDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var genre, games;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                genre = helper_1.getStringFromRequest(req, "gameGenre");
                if (!(genre !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getGamesFromGenreIGDB(genre)];
            case 1:
                games = _a.sent();
                if (!types_1.isError(games)) {
                    res.contentType("json");
                }
                res.send(games);
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
                    res.contentType("image/png");
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
                    res.contentType("image/png");
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
    var gameID, externalSites;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getExternalsIGDB(gameID)];
            case 1:
                externalSites = _a.sent();
                if (!types_1.isError(externalSites)) {
                    res.contentType("json");
                }
                res.send(externalSites);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 3;
            case 3: return [2 /*return*/];
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
exports.plainITAD = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, plain, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                if (!(gameID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.itadGetPlain(gameID)];
            case 1:
                plain = _a.sent();
                if (!types_1.isError(plain)) {
                    res.contentType("json");
                }
                response = {
                    idSteam: gameID,
                    plain: plain["data"]["app/" + gameID]
                };
                res.send(response);
                return [3 /*break*/, 3];
            case 2:
                res.status(400);
                res.send({ error: "Invalid ID" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStoreLow = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var plain, store, storeLow, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                plain = helper_1.getStringFromRequest(req, "plain");
                store = helper_1.getStringFromRequest(req, "store");
                if (!(plain !== false && store != false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.itadStoreLow(plain, store)];
            case 1:
                storeLow = _a.sent();
                if (!types_1.isError(plain) && !types_1.isError(store)) {
                    res.contentType("json");
                }
                if (storeLow["data"].length > 0) {
                    response = {
                        game: plain,
                        store: store,
                        storeLowestPrice: storeLow["data"][plain][0].price
                    };
                    res.send(response);
                }
                else {
                    res.status(404);
                    res.send({ error: "Not Found" });
                }
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
//Steam
exports.priceSteam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var appID, steamPrice, response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appID = helper_1.getIdFromRequest(req);
                if (!(appID !== false)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, core_1.getPriceSteam(appID)];
            case 2:
                steamPrice = _a.sent();
                if (!types_1.isError(steamPrice)) {
                    res.contentType('application/json');
                }
                response = {
                    idSteam: appID,
                    price: steamPrice[appID.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]
                };
                res.send(response);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                res.sendStatus(400);
                res.send({ error: 'Invalid!' });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.sendStatus(400);
                res.send({ error: 'Invalid name format!' });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.activePlayersSteam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var appID, steamPlayers, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appID = helper_1.getIdFromRequest(req);
                if (!(appID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getActivePlayersSteam(appID)];
            case 1:
                steamPlayers = _a.sent();
                if (!types_1.isError(steamPlayers)) {
                    res.contentType('application/json');
                }
                response = {
                    idSteam: appID,
                    activePlayers: steamPlayers["response"]["player_count"]
                };
                res.send(response);
                return [3 /*break*/, 3];
            case 2:
                res.sendStatus(400);
                res.send({ error: 'Invalid name format!' });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
//Twitch
//Ok, already returns exactly id, name and box_art_url
exports.gameTwitch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, gameName, game, game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getIdFromRequest(req);
                gameName = helper_1.getGameNameFromRequest(req);
                if (!(gameID !== false && gameName !== false)) return [3 /*break*/, 1];
                res.status(400);
                res.send({ error: "Provide only game id OR game name" });
                return [3 /*break*/, 6];
            case 1:
                if (!(gameID !== false)) return [3 /*break*/, 3];
                return [4 /*yield*/, core_1.getTwitchGameById(gameID)];
            case 2:
                game = _a.sent();
                if (!types_1.isError(game)) {
                    res.contentType("json");
                }
                res.send(game);
                return [3 /*break*/, 6];
            case 3:
                if (!(gameName !== false)) return [3 /*break*/, 5];
                return [4 /*yield*/, core_1.getTwitchGameByName(gameName)];
            case 4:
                game = _a.sent();
                if (!types_1.isError(game)) {
                    res.contentType("json");
                }
                res.send(game);
                return [3 /*break*/, 6];
            case 5:
                res.status(400);
                res.send({ error: "Invalid parameter" });
                _a.label = 6;
            case 6: return [2 /*return*/];
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
    var gameID, streams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = helper_1.getStringFromRequest(req, "game_id");
                if (!(gameID !== false)) return [3 /*break*/, 2];
                return [4 /*yield*/, core_1.getStreamsTwitch(gameID)];
            case 1:
                streams = _a.sent();
                res.send(streams);
                return [3 /*break*/, 2];
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.videosTwitch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, periodSet, period, sortSet, sort, typeSet, type, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                gameID = helper_1.getStringFromRequest(req, "game_id");
                periodSet = new Set(["all", "day", "week", "month"]);
                period = helper_1.getStringFromRequest(req, "period");
                period = (periodSet.has(String(period))) ? String(period) : "month";
                sortSet = new Set(["time", "views"]);
                sort = helper_1.getStringFromRequest(req, "sort");
                sort = (sortSet.has(String(sort))) ? String(sort) : "views";
                typeSet = new Set(["all", "upload", "archive", "highlight"]);
                type = helper_1.getStringFromRequest(req, "type");
                type = (typeSet.has(String(type))) ? String(type) : "all";
                if (!(gameID !== false)) return [3 /*break*/, 2];
                //const videos = await getVideosTwitch(gameID);
                _b = (_a = res).send;
                return [4 /*yield*/, core_1.getVideosTwitch(gameID, period, sort, type)];
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
