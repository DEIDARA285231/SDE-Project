"use strict";
/*********
 * Core functionalities
 *   All the processing logics are defined here. In this way, we leave in the
 *   controller all the input/output filtering and selection, and here we write
 *   the "raw" logics. In this way they're also re-usable! :)
 *   Obviously, in a real project, those functionalities should be divided as well.
 *   "Core" is not a fixed word for this type of file, sometimes
 *   people put those functions in a Utils file, sometimes in a Helper
 *   file, sometimes in a Services folder with different files for every service..
 *   It really depends on your project, style and personal preference :)
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
exports.getVideosTwitch = exports.getStreamsTwitch = exports.getSearchTwitch = exports.getTopGamesTwitch = exports.getTwitchGameByName = exports.getTwitchGameById = exports.itadStoreLow = exports.itadGetPlain = exports.getActivePlayersSteam = exports.getPriceSteam = exports.getGamePlatformsIGDB = exports.getGameReleasesIGDB = exports.getGameVideosIGDB = exports.getTopRatedIGDB = exports.getExternalsIGDB = exports.getGamesFromGenreIGDB = exports.getCoverIGDB = exports.getArtworkIGDB = exports.getGameIGDB = exports.getHello = void 0;
var qs_1 = __importDefault(require("qs"));
var axios_1 = __importDefault(require("axios"));
var secrets_1 = __importDefault(require("../secrets"));
axios_1.default.defaults.paramsSerializer = function (params) {
    return qs_1.default.stringify(params, { indices: false });
};
exports.getHello = function (name) {
    return {
        text: "Hello " + name,
    };
};
/*
export const getRegions: () => Promise<Region[] | Error> = async () => {
  try {
    const regions = await axios.get<Region[]>(`${config.URL_API_DATA}/regions`);
    return regions.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const getRegionById: (id: number) => Promise<Region | Error> = async (id) => {
  try {
    const region = await axios.get<Region>(`${config.URL_API_DATA}/region/${id}`);
    return region.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
};

export const getCasesByRegionId: (
  id: number,
  year: number,
  month: number,
  day: number
) => Promise<Entry | Error> = async (id, year, month, day) => {
  try {
    const cases = await axios.get<Entry>(`${config.URL_API_DATA}/region/${id}/cases/${year}/${month}/${day}`);
    return cases.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
};

export const getRanking: (
  n: number,
  ord: string,
  year: number,
  month: number,
  day: number
) => Promise<CasesPerRegion[]> = async (n, ord, year, month, day) => {
  const regions = await getRegions();

  let ranks: CasesPerRegion[] = [];
  if (!isError(regions)) {
    for (let i = 0; i < regions.length; i++) {
      const cases = await getCasesByRegionId(regions[i].id, year, month, day);
      if (!isError(cases)) {
        ranks.push({
          region: regions[i],
          cases: cases.total_positive,
        });
      }
    }
  }

  ranks = ranks.sort((a: CasesPerRegion, b: CasesPerRegion) => b.cases - a.cases);
  if (ord === 'asc') {
    ranks = ranks.reverse();
  }
  return ranks.slice(0, n);
};

export const getBarChart: (
  year: number,
  month: number,
  day: number
) => Promise<File | Error> = async (year, month, day) => {
  const regions = await getRegions();

  if (!isError(regions)) {
    let labels = '';
    let data = '';
    let maxCases = 10000;

    // For each region, take the total number of positives and create the parameters query
    for (let i = 0; i < regions.length; i++) {
      const cases = await getCasesByRegionId(regions[i].id, year, month, day);
      if (!isError(cases)) {
        labels += regions[i].name.replace('P.A. ', '').slice(0, 4) + '.|';
        data += cases.total_positive + ',';
        if (cases.total_positive > maxCases) {
          maxCases = cases.total_positive;
        }
      }
    }

    // remove trailing comma and pipe
    if (labels.length > 0) {
      labels = labels.slice(0, -1);
    }
    if (data.length > 0) {
      data = data.slice(0, -1);
    }

    // Let's make the request to google chart API to create the chart
    try {
      const response = await axios.get<File>('https://chart.googleapis.com/chart', {
        responseType: 'arraybuffer', // Needed because the response is not a json but a binary file!
        params: {
          cht: 'bvg',
          chs: `700x250`,
          chtt: 'Covid Infections',
          chds: `0,${maxCases}`,
          chd: `t:${data}`,
          chco: '118ab2',
          chl: `${labels}`,
          chxt: 'x,y',
          chxr: `1,0,${maxCases}`,
        },
      });

      return response.data;
    } catch (e) {
      console.error(e);
      return {
        error: e,
      };
    }
  } else {
    return regions; // It's an error! :( We return it as is.
  }
};

export const getLineChart: (
  id: number,
  year: number,
  month: number,
) => Promise<File | Error> = async (id, year, month) => {
  const region = await getRegionById(id);

  if (!isError(region)) {
    let labels = '';
    let data = '';
    let maxCases = 10000;

    // Get cases for each day of the month
    for (let i = 1; i <= 31; i++) {
      const cases = await getCasesByRegionId(region.id, year, month, i);
      // If the day does not exists, it will be an error,
      // so even if we're trying to get 31th of February,
      // it will not be added to the labels and data!
      if (!isError(cases)) {
        labels += i + '|';
        data += cases.total_positive + ',';
        if (cases.total_positive > maxCases) {
          maxCases = cases.total_positive;
        }
      }
    }

    // remove trailing comma and pipe
    if (labels.length > 0) {
      labels = labels.slice(0, -1);
    }
    if (data.length > 0) {
      data = data.slice(0, -1);
    }

    // Let's make the request to google chart API to create the chart
    try {
      const response = await axios.get<File>('https://chart.googleapis.com/chart', {
        responseType: 'arraybuffer', // Needed because the response is not a json but a binary file!
        params: {
          cht: 'lc',
          chs: `600x250`,
          chtt: 'Covid Infections',
          chds: `0,${maxCases}`,
          chd: `t:${data}`,
          chdl: region.name,
          chco: '118ab2',
          chl: `${labels}`,
          chxt: 'x,y',
          chxr: `1,0,${maxCases}`,
        },
      });

      return response.data;
    } catch (e) {
      console.error(e);
      return {
        error: e,
      };
    }
  } else {
    return region; // It's an error! :( We return it as is.
  }
};
*/
//IGDB
exports.getGameIGDB = function (name) { return __awaiter(void 0, void 0, void 0, function () {
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
                            'Client-ID': 'eizkab37usgvovmohkoug9x2toeg2x',
                            'Authorization': 'Bearer tja4hkdzhlifvxm8n6fgb8dp3c1tdj',
                        },
                        data: "fields *; search \"" + gameName + "\"; limit 1;"
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, e_1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getArtworkIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, response, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post('https://api.igdb.com/v4/artworks', {
                        responseType: 'arraybuffer',
                        headers: {
                            "Authorization": "",
                            "Client-ID": "${CLIENT-ID}"
                        },
                        data: {
                            game: "${gameID}" //We need to define if we want more parameters to be process, for example eliminating the  repetitions
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_2 = _a.sent();
                console.error(e_2);
                return [2 /*return*/, {
                        error: e_2,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCoverIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, response, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post('https://api.igdb.com/v4/covers', {
                        responseType: 'arraybuffer',
                        headers: {
                            "Authorization": "",
                            "Client-ID": "${CLIENT-ID}"
                        },
                        data: {
                            game: "${gameID}" //We need to define if we want more parameters to be process, for example eliminating the  repetitions
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_3 = _a.sent();
                console.error(e_3);
                return [2 /*return*/, {
                        error: e_3,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGamesFromGenreIGDB = function (genre) { return __awaiter(void 0, void 0, void 0, function () {
    var gameGenres, response, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameGenres = genre;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post("https://api.igdb.com/v4/genres", {
                        responseType: "json",
                        headers: {
                            "Authorization": "",
                            "Client-ID": "${CLIENT-ID}"
                        },
                        data: {
                            fields: "*",
                            name: "${gameGenres}"
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_4 = _a.sent();
                console.error(e_4);
                return [2 /*return*/, {
                        error: e_4,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getExternalsIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, response, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post("https://api.igdb.com/v4/external_games", {
                        responseType: "json",
                        headers: {
                            "Authorization": "",
                            "Client-ID": "${CLIENT-ID}"
                        },
                        data: {
                            fields: "*",
                            game: "${gameID}"
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_5 = _a.sent();
                console.error(e_5);
                return [2 /*return*/, {
                        error: e_5,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTopRatedIGDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post("https://api.igdb.com/v4/games/", {
                        responseType: "json",
                        headers: {
                            "Authorization": "",
                            "Client-ID": "${CLIENT-ID}"
                        },
                        data: {
                            fields: "name, rating",
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_6 = _a.sent();
                console.error(e_6);
                return [2 /*return*/, {
                        error: e_6,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getGameVideosIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, response, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post("https://api.igdb.com/v4/game_videos", {
                        responseType: "stream",
                        headers: {
                            "Authorization": "",
                            "Client-ID": "${CLIENT-ID}"
                        },
                        data: {
                            game: "${gameID"
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_7 = _a.sent();
                console.error(e_7);
                return [2 /*return*/, {
                        error: e_7,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGameReleasesIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, response, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post("https://api.igdb.com/v4/release_dates", {
                        responseType: "stream",
                        headers: {
                            "Authorization": "",
                            "Client-ID": "${CLIENT-ID}"
                        },
                        data: {
                            game: "${gameID"
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_8 = _a.sent();
                console.error(e_8);
                return [2 /*return*/, {
                        error: e_8,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGamePlatformsIGDB = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, response, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post("https://api.igdb.com/v4/platforms", {
                        responseType: "stream",
                        headers: {
                            "Authorization": "",
                            "Client-ID": "${CLIENT-ID}"
                        },
                        data: {
                            game: "${gameID"
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_9 = _a.sent();
                console.error(e_9);
                return [2 /*return*/, {
                        error: e_9,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
//Steam
exports.getPriceSteam = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://store.steampowered.com/api/appdetails?appids=" + id + "&currency=eur")];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_10 = _a.sent();
                console.error(e_10);
                return [2 /*return*/, {
                        error: e_10,
                    }];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); };
exports.getActivePlayersSteam = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=" + id)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_11 = _a.sent();
                console.error(e_11);
                return [2 /*return*/, {
                        error: e_11,
                    }];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); };
//Is there any deal
exports.itadGetPlain = function (IDSteam) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get('https://api.isthereanydeal.com/v01/game/plain/id/', { params: {
                            key: secrets_1.default.ITAD_KEY,
                            shop: "steam",
                            ids: "app/" + IDSteam
                        } })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_12 = _a.sent();
                console.error(e_12);
                return [2 /*return*/, {
                        error: e_12,
                    }];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); };
exports.itadStoreLow = function (plain, store) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get('https://api.isthereanydeal.com/v01/game/storelow/', { params: {
                            key: secrets_1.default.ITAD_KEY,
                            plains: plain,
                            region: "eu2",
                            country: "IT",
                            shops: store,
                        } })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_13 = _a.sent();
                console.error(e_13);
                return [2 /*return*/, {
                        error: e_13,
                    }];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); };
//TWITCH
exports.getTwitchGameById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameID, response, e_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameID = id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get("https://api.twitch.tv/helix/games", {
                        responseType: "json",
                        headers: {
                            "Authorization": secrets_1.default.AUTHORIZATION,
                            "Client-Id": secrets_1.default.CLIENT_ID
                        },
                        params: {
                            id: gameID,
                        },
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                e_14 = _a.sent();
                console.log("e");
                return [2 /*return*/, {
                        error: e_14,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTwitchGameByName = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://api.twitch.tv/helix/games", {
                        responseType: "json",
                        headers: {
                            "Authorization": secrets_1.default.AUTHORIZATION,
                            "Client-Id": secrets_1.default.CLIENT_ID
                        },
                        params: {
                            name: name,
                        },
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_15 = _a.sent();
                console.log("e");
                return [2 /*return*/, {
                        error: e_15,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTopGamesTwitch = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://api.twitch.tv/helix/games/top", {
                        responseType: "json",
                        headers: {
                            "Authorization": secrets_1.default.AUTHORIZATION,
                            "Client-Id": secrets_1.default.CLIENT_ID
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_16 = _a.sent();
                console.log("e");
                return [2 /*return*/, {
                        error: e_16,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSearchTwitch = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://api.twitch.tv/helix/search/categories", {
                        responseType: "json",
                        headers: {
                            "Authorization": secrets_1.default.AUTHORIZATION,
                            "Client-Id": secrets_1.default.CLIENT_ID
                        },
                        params: {
                            query: query,
                        },
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_17 = _a.sent();
                console.log("e");
                return [2 /*return*/, {
                        error: e_17,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStreamsTwitch = function (param, gameID) { return __awaiter(void 0, void 0, void 0, function () {
    var response, response1, e_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!(param === true)) return [3 /*break*/, 2];
                return [4 /*yield*/, axios_1.default.get("https://api.twitch.tv/helix/streams", {
                        responseType: "json",
                        headers: {
                            "Authorization": secrets_1.default.AUTHORIZATION,
                            "Client-Id": secrets_1.default.CLIENT_ID
                        },
                        params: {
                            game_id: gameID,
                        },
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2: return [4 /*yield*/, axios_1.default.get("https://api.twitch.tv/helix/streams", {
                    responseType: "json",
                    headers: {
                        "Authorization": secrets_1.default.AUTHORIZATION,
                        "Client-Id": secrets_1.default.CLIENT_ID
                    },
                })];
            case 3:
                response1 = _a.sent();
                return [2 /*return*/, response1.data];
            case 4: return [3 /*break*/, 6];
            case 5:
                e_18 = _a.sent();
                console.log(e_18);
                return [2 /*return*/, {
                        error: e_18,
                    }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getVideosTwitch = function (gameID) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://api.twitch.tv/helix/videos", {
                        responseType: "json",
                        headers: {
                            "Authorization": secrets_1.default.AUTHORIZATION,
                            "Client-Id": secrets_1.default.CLIENT_ID
                        },
                        params: {
                            game_id: gameID,
                        },
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                e_19 = _a.sent();
                console.log(e_19);
                return [2 /*return*/, {
                        error: e_19,
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
