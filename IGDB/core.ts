import { ArtworkCoverIGDB, Error, IGDBGame, IGDBPlatform, IGDBVideo, IGDBPlatformLogo } from './types';
import qs from 'qs';
import axios from 'axios';
import secrets from './secrets';

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

//IGDB

//fix returned fields, storyline may be undefined
export const getGameIGDB: (name: string, limit: number, offset: number) => Promise<IGDBGame[]|Error> = async (name, limit, offset) => {
  const gameName = name;
  try {
    const response = (await axios({
      url: "https://api.igdb.com/v4/games",
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Client-ID': `${secrets.CLIENT_ID}`,
          'Authorization': `${secrets.AUTHORIZATION}`,
      },
      data: `fields: id, first_release_date, name; search "${gameName}"; limit ${limit}; offset ${offset};`
    })).data;
    return response.map((rawData: any) => ({
      id: rawData.id,
      first_release_date: new Date(rawData.first_release_date *1000).toUTCString(),
      name: rawData.name
    }))
  } catch (e) {
    return e;
  }
}

export const getGameIGDBbyID: (id: number) => Promise<IGDBGame | Error> = async (id) => {
  try {
    const response = await axios({
      url: "https://api.igdb.com/v4/games",
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Client-ID': `${secrets.CLIENT_ID}`,
          'Authorization': `${secrets.AUTHORIZATION}`,
      },
      data: `fields: id, aggregated_rating, first_release_date, name, rating, storyline, summary, genres; where id = ${id};`
    })
    let risposta = response.data[0]
    risposta.first_release_date = new Date(risposta.first_release_date *1000).toUTCString()
    return <IGDBGame> risposta;
  } catch (e) {
    return e;
  }
}

export const getArtworkIGDB: (id: number) => Promise<ArtworkCoverIGDB[] | Error> = async (id) => {

  try {
    const response : ArtworkCoverIGDB[] = (await axios({
      url: "https://api.igdb.com/v4/artworks",
      method: 'POST',
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: game, width, height, url; where game = ${id};` //We need to define if we want more parameters to be process, for example eliminating the  repetitions
    })).data;
    return response.map(rawData => ({
      id: rawData.id,
      game: rawData.game,
      width: rawData.width,
      height: rawData.height,
      url: rawData.url.substring(2).replace("t_thumb", "t_original")
    }));
  } catch (e) {
    return e;
  }
}

export const getCoverIGDB: (id: number) => Promise<ArtworkCoverIGDB[] | Error> = async (id) => {
  try {
    const response : ArtworkCoverIGDB[] = (await axios({
      url: "https://api.igdb.com/v4/covers",
      method: 'POST',
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: game, width, height, url; where game = ${id};` //We need to define if we want more parameters to be process, for example eliminating the  repetitions
    })).data;
    return response.map(rawData => ({
      id: rawData.id,
      game: rawData.game,
      width: rawData.width,
      height: rawData.height,
      url: rawData.url.substring(2).replace("t_thumb", "t_original")
    }));
  } catch (e) {
    return e;
  }
}

export const getGenreFromIdIGDB: (id: number) => Promise<any> = async (id) => {
  try {
    const response = await axios({
      url: "https://api.igdb.com/v4/genres",
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: id, name, url; where id = ${id};`
    });
    return response.data[0];
  } catch (e) {
    console.log(e)
    return e;
  }
}

export const getExternalsIGDB: (id: number) => Promise<any> = async (id) => {
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
      data: `fields: game, name, category, uid; where game = ${gameID};`
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getExternalsIGDBbyName: (gameName: string) => Promise<any> = async (gameName) => {
  try{
    const response = await axios({
      url: "https://api.igdb.com/v4/external_games",
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: game, name, category, uid; where name = "${gameName}";`
    });
    return response.data;
  } catch (e) {
    return e;
  }
}

export const getTopRatedIGDB: () => Promise<IGDBGame[]|Error> = async () => {
  try{
    const response = (await axios({
      url: "https://api.igdb.com/v4/games/",
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: id, first_release_date, name, rating; sort rating desc; where rating != null & category = 0;`
    })).data;
    return response.map((rawData: any) => ({
      id: rawData.id,
      first_release_date: new Date(rawData.first_release_date *1000).toUTCString(),
      name: rawData.name,
      rating: rawData.rating
    }));
  } catch (e) {
    return e;
  }
}

export const getGameVideosIGDB: (id: number) => Promise<IGDBVideo[] | Error> = async (id) => {
  try{
    const response : IGDBVideo[] = (await axios({
      url: "https://api.igdb.com/v4/game_videos",
      method: 'POST',
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`,
      },
      data: `fields: name, game, video_id; where game = ${id};`
    })).data
    return response.map((rawData: any) => ({
      gameId: rawData.game,
      video_name: rawData.name,
      videoId: rawData.video_id
    }));
  } catch (e) {
    return e;
  }
}

export const getPlatformsIGDB: (id: number) => Promise<IGDBPlatform | Error> = async (id) => {
  try{
    const response = (await axios({
      url: "https://api.igdb.com/v4/platforms",
      method: 'POST',
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: id, alternative_name, name, platform_logo; where id=${id};`
    })).data[0];
    const returnObject : IGDBPlatform = {
      id: response.id,
      name: response.name,
      alternative_name: response.alternative_name,
      platform_logo_url: response.platform_logo
    }
    return returnObject
  } catch (e) {
    return e;
  }
}

export const getGamePlatformsLogoIGDB: (idLogo: number) => Promise<IGDBPlatformLogo | Error> = async (idLogo) => {
  try{
    const response = (await axios({
      url: "https://api.igdb.com/v4/platform_logos",
      method: 'POST',
      headers: {
        "Authorization": `${secrets.AUTHORIZATION}`, //Still need to obtain it, we need to ideate a way to get it
        "Client-ID": `${secrets.CLIENT_ID}`
      },
      data: `fields: id, width, height, url; where id=${idLogo};`
    })).data[0];

    const returnObject : IGDBPlatformLogo = {
      id: response.id,
      width: response.width,
      height: response.height,
      url: response.url.substring(2).replace("t_thumb", "t_original")
    }
    return returnObject
  } catch (e) {
    return e;
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
