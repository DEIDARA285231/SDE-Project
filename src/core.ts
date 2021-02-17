import { ArtworkCoverIGDB, Error, IGDBGame } from './types';
import qs from 'qs';
import axios from 'axios';
import secrets from '../secrets';
import { raw } from 'body-parser';

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
      data: `fields: id, aggregated_rating, first_release_date, name, rating, storyline, summary, genres; search "${gameName}"; limit ${limit}; offset ${offset};`
    })).data;
    return response.map((rawData: any) => ({
      id: rawData.id,
      first_release_date: new Date(rawData.first_release_date *1000).toUTCString(),
      aggregated_rating: rawData.aggregated_rating,
      name: rawData.name,
      rating: rawData.rating,
      storyline: rawData.storyline,
      summary: rawData.summary,
      genres: rawData.genres
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

export const getArtworkIGDB: (id: number) => Promise<any> = async (id) => {

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

export const getCoverIGDB: (id: number) => Promise<any> = async (id) => {
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
      data: `fields: id, aggregated_rating, first_release_date, name, rating, storyline, summary, genres; sort rating desc; where rating != null & category = 0;`
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
