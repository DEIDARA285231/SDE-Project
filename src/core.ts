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

import { Error, isError, ResponseSteam, TwitchVideos } from './types';
import config from '../config';
import qs from 'qs';

import axios from 'axios';
import secrets from '../secrets';
import { getGameNameFromRequest } from './helper';
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

//IGDB

export const getGameIGDB: (name: string) => Promise<any> = async (name) => {
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

export const getArtworkIGDB: (id: number) => Promise<File | Error> = async (id) => {
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

export const getCoverIGDB: (id: number) => Promise<File | Error> = async (id) => {
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

export const getGamesFromGenreIGDB: (genre: string) => Promise<File | Error> = async (genre) => {
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

export const getExternalsIGDB: (id: number) => Promise<File | Error> = async (id) => {
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

export const getVideosTwitch: (gameID: string) => Promise<TwitchVideos[] | Error> = async (gameID) => {

  try{
    const response = await axios.get<TwitchVideos[]>("https://api.twitch.tv/helix/videos",{
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

export const getSpeedrunGameByName: (gameID: string) => Promise<any | Error> = async (gameID) => {

  try{
    const response = await axios.get<any>("https://www.speedrun.com/api/v1/games",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      },
      params: {
        name: gameID,
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
