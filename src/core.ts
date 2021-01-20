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

import { Error, isError, ResponseSteam } from './types';
import config from '../config';
import qs from 'qs';

import axios from 'axios';
import secrets from '../secrets';
import { getGameNameFromRequest } from './helper';
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

export const getHello: (name: string) => { text: string } = (name) => {
  return {
    text: `Hello ${name}`,
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

export const getGameIGDB: (
  name: string
) => Promise<any> = async (name) => {
  const gameName = name;
  try {
    const response = await axios({
      url: "https://api.igdb.com/v4/games",
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Client-ID': 'eizkab37usgvovmohkoug9x2toeg2x',
          'Authorization': 'Bearer tja4hkdzhlifvxm8n6fgb8dp3c1tdj',
      },
      data: `fields *; search "${gameName}"; limit 1;`
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getArtworkIGDB: (
  id: number
) => Promise<File | Error> = async (id) => {
  const gameID = id;
  try {
    const response = await axios.post<File>('https://api.igdb.com/v4/artworks', {
      responseType: 'arraybuffer',
      headers: {
        "Authorization": "", //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": "${CLIENT-ID}"
      },
      data: {
        game: "${gameID}" //We need to define if we want more parameters to be process, for example eliminating the  repetitions
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
}

export const getCoverIGDB: (
  id: number
) => Promise<File | Error> = async (id) => {
  const gameID = id;
  try {
    const response = await axios.post<File>('https://api.igdb.com/v4/covers', {
      responseType: 'arraybuffer',
      headers: {
        "Authorization": "", //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": "${CLIENT-ID}"
      },
      data: {
        game: "${gameID}" //We need to define if we want more parameters to be process, for example eliminating the  repetitions
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
}

export const getGamesFromGenreIGDB: (
  genre: string
) => Promise<File | Error> = async (genre) => {
  const gameGenres = genre;
  try {
    const response = await axios.post<File>("https://api.igdb.com/v4/genres", {
      responseType: "json",
      headers: {
        "Authorization": "", //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": "${CLIENT-ID}"
      },
      data: {
        fields: "*",
        name: "${gameGenres}"
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
}

export const getExternalsIGDB: (
  id: number
) => Promise<File | Error> = async (id) => {
  const gameID = id;
  try{
    const response = await axios.post<File>("https://api.igdb.com/v4/external_games", {
      responseType: "json",
      headers: {
        "Authorization": "", //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": "${CLIENT-ID}"
      },
      data: {
        fields: "*",
        game: "${gameID}"
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
}

export const getTopRatedIGDB: () => Promise<File | Error> = async () => {
  try{
    const response = await axios.post<File>("https://api.igdb.com/v4/games/", {
      responseType: "json",
      headers: {
        "Authorization": "", //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": "${CLIENT-ID}"
      },
      data: {
        fields: "name, rating",
        //Missing the sort
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
}

export const getGameVideosIGDB: (id: number) => Promise<File | Error> = async (id) => {
  const gameID = id;
  try{
    const response = await axios.post<File>("https://api.igdb.com/v4/game_videos", {
      responseType: "stream",
      headers: {
        "Authorization": "", //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": "${CLIENT-ID}"
      },
      data: {
        game: "${gameID"
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
}

export const getGameReleasesIGDB: (id: number) => Promise<File | Error> = async (id) => {
  const gameID = id;
  try{
    const response = await axios.post<File>("https://api.igdb.com/v4/release_dates",{
      responseType: "stream",
      headers: {
        "Authorization": "", //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": "${CLIENT-ID}"
      },
      data: {
        game: "${gameID"
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
}

export const getGamePlatformsIGDB: (id: number) => Promise<File | Error> = async (id) => {
  const gameID = id;
  try{
    const response = await axios.post<File>("https://api.igdb.com/v4/platforms",{
      responseType: "stream",
      headers: {
        "Authorization": "", //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": "${CLIENT-ID}"
      },
      data: {
        game: "${gameID"
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e,
    };
  }
}

//Steam

export const getPriceSteam: (name: string) => Promise<any | Error> = async (name) => {
  //chiama il nostro servizio per avere l'id steam del gioco (con rest) e assegnalo ad appID
  let appID=0;
  try {
    const response = await axios.get<any>(`https://store.steampowered.com/api/appdetails?appids=1091500&currency=eur`);
    //let infoApp=response.data;
    //let price=infoApp["1091500"].data["package_groups"][0].subs[0]["price_in_cents_with_discount"];
    //return price/100;
    return response.data;
  } catch(e) {
    console.error(e);
    return e;
  };
}

export const getActivePlayersSteam: (name: string) => Promise<any | Error> = async (name) => {
  //chiama il nostro servizio per avere l'id steam del gioco (con rest) e assegnalo ad appID
  let appID=0;

  axios.get<any>(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appID}`).then((response) =>{
    let infoApp=response.data;

    return infoApp["player_count"];
  }).catch((e) => {
    console.error(e);
    return {
      error: e,
    };
  });
};

//Is there any deal

export const itadGetPlain: (IDSteam: number) => Promise<any | Error> = async (IDSteam) => {
  //parametro idSteam è l'id steam
  axios.get<any>('https://api.isthereanydeal.com/v01/game/plain/id/',{ params: {
    key: secrets.ITAD_KEY,
    shop: "steam",
    ids: `app/${IDSteam}`
    }
  }).then((response) =>{
    let infoApp=response.data;

    return infoApp[`app/${IDSteam}`];
  }).catch((e) => {
    console.error(e);
    return {
      error: e,
    };
  });
};

export const itadHistoricalLow: (plain: string) => Promise<any | Error> = async (plain) => {
  //parametro idSteam è l'id steam
  axios.get<any>('https://api.isthereanydeal.com/v01/game/lowest/',{ params: {
    key: secrets.ITAD_KEY,
    plains: plain,
    region: "eu2",
    country: "IT",
    shops: "steam",
    }
  }).then((response) =>{
    let infoApp=response.data;

    //qui dovrebbe esserci sia prezzo (.price) che data di aggiunta in long (.added)
    return infoApp[plain];
  }).catch((e) => {
    console.error(e);
    return {
      error: e,
    };
  });
};

//TWITCH

export const getTwitchGameById: (id: number) => Promise<File | Error> = async (id) => {

  const gameID = id;

  try{
    const response = await axios.get<File>("https://api.twitch.tv/helix/games",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      },
      params: {
        id: gameID,
      },
    });
    return response.data;
  } catch (e) {
    console.log("e");
    return {
      error: e,
    };
  }
}

export const getTwitchGameByName: (name: string) => Promise<File | Error> = async (name) => {

  try{
    const response = await axios.get<File>("https://api.twitch.tv/helix/games",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      },
      params: {
        name: name,
      },
    });
    return response.data;
  } catch (e) {
    console.log("e");
    return {
      error: e,
    };
  }
}

export const getTopGamesTwitch: () => Promise<File | Error> = async () => {

  try{
    const response = await axios.get<File>("https://api.twitch.tv/helix/games/top",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      }
    });
    return response.data;
  } catch (e) {
    console.log("e");
    return {
      error: e,
    };
  }
}

export const getSearchTwitch: (query: string) => Promise<File | Error> = async (query) => {

  try{
    const response = await axios.get<File>("https://api.twitch.tv/helix/search/categories",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      },
      params: {
        query: query,
      },
    });
    return response.data;
  } catch (e) {
    console.log("e");
    return {
      error: e,
    };
  }
}

export const getStreamsTwitch: (param: Boolean, gameID: string) => Promise<File | Error> = async (param, gameID) => {

  try{
    if(param===true) {
      const response = await axios.get<File>("https://api.twitch.tv/helix/streams",{
        responseType: "json",
        headers: {
          "Authorization": secrets.AUTHORIZATION,
          "Client-Id": secrets.CLIENT_ID
        },
        params: {
          game_id: gameID,
        },
      });
      return response.data;
    } else {
      const response1 = await axios.get<File>("https://api.twitch.tv/helix/streams",{
        responseType: "json",
        headers: {
          "Authorization": secrets.AUTHORIZATION,
          "Client-Id": secrets.CLIENT_ID
        },
      });
      return response1.data;
    }
  } catch (e) {
    console.log(e);
    return {
      error: e,
    };
  }
}

export const getVideosTwitch: (gameID: string) => Promise<File | Error> = async (gameID) => {

  try{
    const response = await axios.get<File>("https://api.twitch.tv/helix/videos",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      },
      params: {
        game_id: gameID,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return {
      error: e,
    };
  }
}
