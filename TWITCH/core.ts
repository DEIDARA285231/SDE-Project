import { Error, TwitchStream, TwitchTopGame, TwitchVideo } from './types';
import qs from 'qs';
import axios from 'axios';
import secrets from './secrets';

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

export const getTwitchGameById: (id: string) => Promise<File | Error> = async (id) => {

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

export const getTwitchGameByName: (name: string) => Promise<any | Error> = async (name) => {

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
      name: rawdata.name,
      box_art_url: rawdata.box_art_url
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

export const getStreamsTwitch: (param: Boolean, gameID: string) => Promise<TwitchStream[] | Error> = async (param, gameID) => {

  try{

    if(param===true) {
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
    } else {
      const response: TwitchStream[] = (await axios.get<any>("https://api.twitch.tv/helix/streams",{
        responseType: "json",
        headers: {
          "Authorization": secrets.AUTHORIZATION,
          "Client-Id": secrets.CLIENT_ID
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
    }
  } catch (e) {
    console.log(e);
    return {
      error: e,
    };
  }
}

export const getVideosTwitch: (gameID: string, period: string, sort: string, type: string) => Promise<TwitchVideo[] | Error> = async (gameID, period, sort, type) => {

  try{
    const response: TwitchVideo[] = (await axios.get<any>("https://api.twitch.tv/helix/videos",{
      responseType: "json",
      headers: {
        "Authorization": secrets.AUTHORIZATION,
        "Client-Id": secrets.CLIENT_ID
      },
      params: {
        game_id: gameID,
        period: period,
        sort: sort,
        type: type
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
