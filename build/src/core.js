"use strict";
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
exports.getSpeedrunGameByName = exports.getGamePlatformsLogoIGDB = exports.getPlatformsIGDB = exports.getGameVideosIGDB = exports.getTopRatedIGDB = exports.getExternalsIGDBbyName = exports.getExternalsIGDB = exports.getGenreFromIdIGDB = exports.getCoverIGDB = exports.getArtworkIGDB = exports.getGameIGDBbyID = exports.getGameIGDB = void 0;
var qs_1 = __importDefault(require("qs"));
var axios_1 = __importDefault(require("axios"));
var secrets_1 = __importDefault(require("../secrets"));
axios_1.default.defaults.paramsSerializer = function (params) {
    return qs_1.default.stringify(params, { indices: false });
};
//IGDB
//fix returned fields, storyline may be undefined
exports.getGameIGDB = function (name, limit, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var gameName, response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameName = name;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/games",
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Client-ID': "" + secrets_1.default.CLIENT_ID,
                            'Authorization': "" + secrets_1.default.AUTHORIZATION,
                        },
                        data: "fields: id, first_release_date, name; search \"" + gameName + "\"; limit " + limit + "; offset " + offset + ";"
                    })];
            case 2:
                response = (_a.sent()).data;
                return [2 /*return*/, response.map(function (rawData) { return ({
                        id: rawData.id,
                        first_release_date: new Date(rawData.first_release_date * 1000).toUTCString(),
                        name: rawData.name
                    }); })];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, e_1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGameIGDBbyID = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, risposta, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/games",
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Client-ID': "" + secrets_1.default.CLIENT_ID,
                            'Authorization': "" + secrets_1.default.AUTHORIZATION,
                        },
                        data: "fields: id, aggregated_rating, first_release_date, name, rating, storyline, summary, genres; where id = " + id + ";"
                    })];
            case 1:
                response = _a.sent();
                risposta = response.data[0];
                risposta.first_release_date = new Date(risposta.first_release_date * 1000).toUTCString();
                return [2 /*return*/, risposta];
            case 2:
                e_2 = _a.sent();
                return [2 /*return*/, e_2];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getArtworkIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/artworks",
                        method: 'POST',
                        headers: {
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID
                        },
                        data: "fields: game, width, height, url; where game = " + id + ";" //We need to define if we want more parameters to be process, for example eliminating the  repetitions
                    })];
            case 1:
                response = (_a.sent()).data;
                return [2 /*return*/, response.map(function (rawData) { return ({
                        id: rawData.id,
                        game: rawData.game,
                        width: rawData.width,
                        height: rawData.height,
                        url: rawData.url.substring(2).replace("t_thumb", "t_original")
                    }); })];
            case 2:
                e_3 = _a.sent();
                return [2 /*return*/, e_3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCoverIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/covers",
                        method: 'POST',
                        headers: {
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID
                        },
                        data: "fields: game, width, height, url; where game = " + id + ";" //We need to define if we want more parameters to be process, for example eliminating the  repetitions
                    })];
            case 1:
                response = (_a.sent()).data;
                return [2 /*return*/, response.map(function (rawData) { return ({
                        id: rawData.id,
                        game: rawData.game,
                        width: rawData.width,
                        height: rawData.height,
                        url: rawData.url.substring(2).replace("t_thumb", "t_original")
                    }); })];
            case 2:
                e_4 = _a.sent();
                return [2 /*return*/, e_4];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getGenreFromIdIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/genres",
                        method: 'POST',
                        headers: {
                            "Accept": "application/json",
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID
                        },
                        data: "fields: id, name, url; where id = " + id + ";"
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data[0]];
            case 2:
                e_5 = _a.sent();
                console.log(e_5);
                return [2 /*return*/, e_5];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getExternalsIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, response, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/external_games",
                        method: 'POST',
                        headers: {
                            "Accept": "application/json",
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID
                        },
                        data: "fields: game, name, category, uid; where game = " + gameID + ";"
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_6 = _a.sent();
                return [2 /*return*/, e_6];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getExternalsIGDBbyName = function (gameName) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/external_games",
                        method: 'POST',
                        headers: {
                            "Accept": "application/json",
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID
                        },
                        data: "fields: game, name, category, uid; where name = \"" + gameName + "\";"
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_7 = _a.sent();
                return [2 /*return*/, e_7];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTopRatedIGDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/games/",
                        method: 'POST',
                        headers: {
                            "Accept": "application/json",
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID
                        },
                        data: "fields: id, first_release_date, name, rating; sort rating desc; where rating != null & category = 0;"
                    })];
            case 1:
                response = (_a.sent()).data;
                return [2 /*return*/, response.map(function (rawData) { return ({
                        id: rawData.id,
                        first_release_date: new Date(rawData.first_release_date * 1000).toUTCString(),
                        name: rawData.name,
                        rating: rawData.rating
                    }); })];
            case 2:
                e_8 = _a.sent();
                return [2 /*return*/, e_8];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getGameVideosIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/game_videos",
                        method: 'POST',
                        headers: {
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID,
                        },
                        data: "fields: name, game, video_id; where game = " + id + ";"
                    })];
            case 1:
                response = (_a.sent()).data;
                return [2 /*return*/, response.map(function (rawData) { return ({
                        gameId: rawData.game,
                        video_name: rawData.name,
                        videoId: rawData.video_id
                    }); })];
            case 2:
                e_9 = _a.sent();
                return [2 /*return*/, e_9];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPlatformsIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, returnObject, e_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/platforms",
                        method: 'POST',
                        headers: {
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID
                        },
                        data: "fields: id, alternative_name, name, platform_logo; where id=" + id + ";"
                    })];
            case 1:
                response = (_a.sent()).data[0];
                returnObject = {
                    id: response.id,
                    name: response.name,
                    alternative_name: response.alternative_name,
                    platform_logo_url: response.platform_logo
                };
                return [2 /*return*/, returnObject];
            case 2:
                e_10 = _a.sent();
                return [2 /*return*/, e_10];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getGamePlatformsLogoIGDB = function (idLogo) { return __awaiter(void 0, void 0, void 0, function () {
    var response, returnObject, e_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default({
                        url: "https://api.igdb.com/v4/platform_logos",
                        method: 'POST',
                        headers: {
                            "Authorization": "" + secrets_1.default.AUTHORIZATION,
                            "Client-ID": "" + secrets_1.default.CLIENT_ID
                        },
                        data: "fields: id, width, height, url; where id=" + idLogo + ";"
                    })];
            case 1:
                response = (_a.sent()).data[0];
                returnObject = {
                    id: response.id,
                    width: response.width,
                    height: response.height,
                    url: response.url.substring(2).replace("t_thumb", "t_original")
                };
                return [2 /*return*/, returnObject];
            case 2:
                e_11 = _a.sent();
                return [2 /*return*/, e_11];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSpeedrunGameByName = function (gameName) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://www.speedrun.com/api/v1/games", {
                        responseType: "json",
                        headers: {
                            "Authorization": secrets_1.default.AUTHORIZATION,
                            "Client-Id": secrets_1.default.CLIENT_ID
                        },
                        params: {
                            name: gameName,
                        },
                    })];
            case 1:
                response = (_a.sent()).data.data;
                return [2 /*return*/, response
                        .map(function (rawdata) { return ({
                        id: rawdata.id,
                        names: rawdata.names,
                        abbreviation: rawdata.abbreviation,
                        weblink: rawdata.weblink,
                        links: rawdata.links
                    }); })];
            case 2:
                e_12 = _a.sent();
                console.log(e_12);
                return [2 /*return*/, {
                        error: e_12,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
