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

import { Error, TwitchStream, TwitchTopGame, TwitchVideo } from './types';
import config from '../config/config';
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
          'Client-ID': `${secrets.CLIENT_ID}`,
          'Authorization': `${secrets.AUTHORIZATION}`,
      },
      data: `fields *; search "${gameName}"; limit 1;`
    });
    return response.data[0];
  } catch (e) {
    return e;
  }
}

export const getGameIGDBbyID: (id: number) => Promise<any> = async (id) => {
  try {
    const response = await axios({
      url: "https://api.igdb.com/v4/games",
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Client-ID': `${secrets.CLIENT_ID}`,
          'Authorization': `${secrets.AUTHORIZATION}`,
      },
      data: `fields *; where id = ${id};`
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getArtworkIGDB: (
  id: number
) => Promise<any> = async (id) => {
  const gameID = id;
  try {
    const response = await axios({
      url: "https://api.igdb.com/v4/artworks",
      method: 'POST',
      responseType: 'arraybuffer',
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `game: "${gameID}";` //We need to define if we want more parameters to be process, for example eliminating the  repetitions
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getCoverIGDB: (
  id: number
) => Promise<any> = async (id) => {
  const gameID = id;
  try {
    const response = await axios({
      url: 'https://api.igdb.com/v4/covers',
      responseType: 'arraybuffer',
      method: 'POST',
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `game: "${gameID}";` //We need to define if we want more parameters to be process, for example eliminating the  repetitions
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getGamesFromGenreIGDB: (
  genre: string
) => Promise<any> = async (genre) => {
  const gameGenres = genre;
  try {
    const response = await axios({
      url: "https://api.igdb.com/v4/genres",
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: *; where name = "${gameGenres}";`
    });
    return response.data;
  } catch (e) {
    console.log(e)
    return e;
  }
}

export const getExternalsIGDB: (
  id: number
) => Promise<any> = async (id) => {
  const gameID = id;
  try{
    const response = await axios({
      url: "https://api.igdb.com/v4/external_games",
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields id, category, uid; where game = ${gameID};`
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getTopRatedIGDB: () => Promise<any> = async () => {
  try{
    const response = await axios({
      url: "https://api.igdb.com/v4/games/",
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: "name, rating";` //Missing the sort
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getGameVideosIGDB: (id: number) => Promise<any> = async (id) => {
  const gameID = id;
  try{
    const response = await axios({
      url: "https://api.igdb.com/v4/game_videos",
      method: 'POST',
      responseType: "stream",
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`,
      },
      data: `game: "${gameID};"`
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getGameReleasesIGDB: (id: number) => Promise<any> = async (id) => {
  const gameID = id;
  try{
    const response = await axios({
      url: "https://api.igdb.com/v4/release_dates",
      method: 'POST',
      responseType: "stream",
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `game: "${gameID};"`
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getGamePlatformsIGDB: (id: number) => Promise<any> = async (id) => {
  const gameID = id;
  try{
    const response = await axios({
      url: "https://api.igdb.com/v4/platforms",
      method: 'POST',
      responseType: "stream",
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `game: "${gameID};"`
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

//Steam

export const getPriceSteam: (id: number) => Promise<any | Error> = async (id) => {
  try {
    const response = await axios.get<any>(`https://store.steampowered.com/api/appdetails?appids=${id}&currency=eur`);
    return response.data;
  } catch(e) {
    console.error(e);
    return {
      error: e,
    };
  };
}

export const getActivePlayersSteam: (id: number) => Promise<any | Error> = async (id) => {
  try{
    const response = await axios.get<any>(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${id}`);
    return response.data;
  } catch(e) {
    console.error(e);
    return {
      error: e,
    };
  };
};

//Is there any deal

export const itadGetPlain: (IDSteam: number) => Promise<any | Error> = async (IDSteam) => {
  try{
    const response = await axios.get<any>('https://api.isthereanydeal.com/v01/game/plain/id/',{ params: {
      key: secrets.ITAD_KEY,
      shop: "steam",
      ids: `app/${IDSteam}`
      }})
    return response.data;
  } catch(e){
    console.error(e);
    return {
      error: e,
    };
  };
};

export const itadStoreLow: (plain: string, store: string) => Promise<any | Error> = async (plain, store) => {
  try{
    const response = await axios.get<any>('https://api.isthereanydeal.com/v01/game/storelow/',{ params: {
      key: secrets.ITAD_KEY,
      plains: plain,
      region: "eu2",
      country: "IT",
      shops: store,
      }})
    return response.data;
  } catch(e) {
    console.error(e);
    return {
      error: e,
    };
  };
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

export const getTopGamesTwitch: () => Promise<TwitchTopGame[] | Error> = async () => {

  try{
    const response: TwitchTopGame[] =(await axios.get<any>("https://api.twitch.tv/helix/games/top",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      }
    })).data.data;
    return response
    .map(rawdata => ({
      id: rawdata.id,
      name: rawdata.name
    }));
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

export const getStreamsTwitch: (gameID: string) => Promise<TwitchStream[] | Error> = async (gameID) => {

  try{
    const response: TwitchStream[] = (await axios.get<any>("https://api.twitch.tv/helix/streams",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      },
      params: {
        game_id: gameID,
      },
    })).data.data;
    return response
    .map(rawData => ({
      user_name: rawData.user_name,
      viewer_count: rawData.viewer_count,
      game_name: rawData.game_name,
      game_id: rawData.game_id,
      title: rawData.title,
      language: rawData.language
    }));
  } catch (e) {
    console.log(e);
    return {
      error: e,
    };
  }
}

export const getVideosTwitch: (gameID: string) => Promise<TwitchVideo[] | Error> = async (gameID) => {

  try{
    const response: TwitchVideo[] = (await axios.get<any>("https://api.twitch.tv/helix/videos",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      },
      params: {
        game_id: gameID,
      },
    })).data.data;
    return response
    .map(rawData => ({
      game_id: gameID,
      user_name: rawData.user_name,
      view_count: rawData.view_count,
      title: rawData.title,
      language: rawData.language,
      duration: rawData.duration,
      url: rawData.url,
      type: rawData.type
    }));
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
