import { Request, Response } from 'express';

import { isError } from './types';
import {
  getTwitchGameById,
  getTopGamesTwitch,
  getSearchTwitch,
  getStreamsTwitch,
  getTwitchGameByName,
  getVideosTwitch} from './core';
import {
  getGameNameFromRequest,
  getIdFromRequest,
  getStringFromRequest,
  getNumberFromRequest,
} from './helper';

import axios from 'axios';
import config from './config'


export const gameTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  const gameName = getGameNameFromRequest(req);
  const twitchID = getNumberFromRequest(req,"twitch_id");

  if((gameID && gameName) || (gameID && twitchID) || (gameName && twitchID)) {
    res.status(400);
    res.send({error: "Provide only game id, game name, or twitch id"})
  } else if(gameID !== false) {
    try{
      let gameInDB = (await axios.get(`${config.DB_ADAPTER}/find`, {params: { id: gameID } })).data;

      //c'è il gioco nel DB
      if (gameInDB.twitchId !== undefined){
        const game = await getTwitchGameById(String(gameInDB.twitchId));
        if(!isError(game)){
          res.send(game);
        }else{
          res.status(503);
          res.send({error: "Twitch unavailable"})
        }  
      }else{
        res.status(404);
        res.send({error: "Game not broadcasted on Twitch"})
      }
    }catch(e){
      try{
        const responseExt = await axios({
          url: `${config.API_IGDB}/game/externalGame`,
          method: 'GET',
          params: {
            id: gameID
          }
        });
        if (responseExt.data.twitchId !== undefined){
          const game = await getTwitchGameById(String(responseExt.data.twitchId));
          if(!isError(game)){
            res.send(game);
          }else{
            res.status(503);
            res.send({error: "Twitch unavailable"})
          }
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }catch(e){
        res.status(404);
        res.send({error: "Game not found on IGDB"})
      }
    }
  } else if(gameName !== false) {
    try{
      let gameInDB = (await axios.get(`${config.DB_ADAPTER}/find`, {params: { name: gameName } })).data;

      if (gameInDB.twitchId !== undefined){
        const game = await getTwitchGameById(String(gameInDB.twitchId));
        if(!isError(game)){
          res.send(game);
        }else{
          res.status(503);
          res.send({error: "Twitch unavailable"})
        }
      }else{
        res.status(404);
        res.send({error: "Game not broadcasted on Twitch"})
      }
    }catch(e){
      try{
        const responseExt = await axios({
          url: `${config.API_IGDB}/game/externalGame`,
          method: 'GET',
          params: {
            name: gameName
          }
        });
        if (responseExt.data.twitchId !== undefined){
          const game = await getTwitchGameById(String(responseExt.data.twitchId));
          res.send(game);
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }catch(e){
        //gameName non negli externals
        const game = await getTwitchGameByName(gameName)
        if (!isError(game)) {
          if (game.data.length > 0){
            res.send(game.data)
          }else{
            res.status(404);
            res.send({error: "Game not broadcasted on Twitch"})
          }
        }else{
          res.status(503);
          res.send({error: "Twitch unavailable"})
        }
      }
    }
  } else if (twitchID !== false) {
    const game = await getTwitchGameById(twitchID.toString());
    if(!isError(game)) {
      res.send(game);
    }else{
      res.status(503);
      res.send({error: "Something bad happened. Error from Twitch itself!"})
    }
  } else {
    res.status(400);
    res.send({error: "No correct parameter specified"})
  }
};

//ok
export const topGamesTwitch = async (req: Request, res: Response) => {
  const topGames = await getTopGamesTwitch();
  if(!isError(topGames)){
    res.send(topGames);
  }else{
    res.status(503);
    res.send({error: "Twitch unavailable"});
  }
};

//ok
export const searchTwitch = async (req: Request, res: Response) => {
  const query = getStringFromRequest(req,"query");
  if(query !== false){
    const searchedGames = await getSearchTwitch(query);
    if(!isError(searchedGames)){
      res.send(searchedGames);
    }else{
      res.status(503);
      res.send({error: "Twitch unavailable"});
    }
  } else {
    res.status(400);
    res.send({error: "Invalid parameter"});
  }
};

//ok
export const streamsTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  const twitchID = getNumberFromRequest(req,"twitch_id");
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/
  if(gameID && twitchID) {
    res.status(400);
    res.send({error: "Provide only game id or twitch id"})
  }else if(gameID) {
    try{
      let gameInDB = (await axios.get(`${config.DB_ADAPTER}/find`, {params: { id: gameID } })).data;
      
      if (gameInDB.twitchId !== undefined){
        const streams = await getStreamsTwitch(true, String(gameInDB.twitchId));
        if(!isError(streams)){
          res.send(streams);
        }else{
          res.status(503);
          res.send({error: "Twitch unavailable"})
        }
      }else{
        res.status(404);
        res.send({error: "Game not broadcasted on Twitch"})
      }
    }catch(e){
      try{
        const responseExt = await axios({
          url: `${config.API_IGDB}/game/externalGame`,
          method: 'GET',
          params: {
            id: gameID
          }
        });
        if (responseExt.data.twitchId !== undefined){
          const streams = await getStreamsTwitch(true, String(responseExt.data.twitchId));
          if(!isError(streams)){
            res.send(streams);
          }else{
            res.status(503);
            res.send({error: "Twitch unavailable"})
          }
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }catch(e){
        res.status(404);
        res.send({error: "Game not found"})
      }
    }
  } else if(twitchID) {
    const streams1 = await getStreamsTwitch(true,String(twitchID));
    if(!isError(streams1)){
      res.send(streams1);
    }else{
      res.status(503);
      res.send({error: "Twitch unavailable"})
    }
  } else{
    const streams2 = await getStreamsTwitch(false,"");
    if(!isError(streams2)) {
      res.send(streams2);
    }else{
      res.status(503);
      res.send({error: "Twitch unavailable"})
    }
  }
};

//ok
export const videosTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  const twitchID = getNumberFromRequest(req,"twitch_id");

  let periodSet = new Set(["all", "day", "week", "month"])
  let period = getStringFromRequest(req, "period");
  period = (periodSet.has(String(period))) ? String(period) : "month";

  let sortSet = new Set(["time", "views"])
  let sort = getStringFromRequest(req, "sort");
  sort = (sortSet.has(String(sort))) ? String(sort) : "views";

  let typeSet = new Set(["all", "upload", "archive", "highlight"])
  let type = getStringFromRequest(req, "type");
  type = (typeSet.has(String(type))) ? String(type) : "all";
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/

  if(gameID && twitchID) {
    res.status(400);
    res.send({error: "Provide game id OR twitch id"})
  } else if(gameID) {
    try{
      let gameInDB = (await axios.get(`${config.DB_ADAPTER}/find`, {params: { id: gameID } })).data;

      if (gameInDB.twitchId !== undefined) {
        const videos = await getVideosTwitch(String(gameInDB.twitchId), period, sort, type);
        if(!isError(videos)){
          res.send(videos);
        }else{
          res.status(503);
          res.send({error: "Twitch unavailable"})
        }
      }else{
        res.status(404);
        res.send({error: "Game not broadcasted on Twitch"})
      }
    }catch(e){
      try{
        const responseExt = await axios({
          url: `${config.API_IGDB}/game/externalGame`,
          method: 'GET',
          params: {
            id: gameID
          }
        });
        if (responseExt.data.twitchId !== undefined){
          const videos = await getVideosTwitch(String(responseExt.data.twitchId), period, sort, type)
          if(!isError(videos)){
            res.send(videos);
          }else{
            res.status(503);
            res.send({error: "Twitch unavailable"})
          }
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }catch(e){
        res.status(404);
        res.send({error: "Game not found on IGDB"})
      }
    }
  } else if(twitchID) {
    const videos = await getVideosTwitch(String(twitchID), period, sort, type);
    if(!isError(videos)){
      res.send(videos);
    }else{
      res.status(503);
      res.send({error: "Twitch unavailable"});
    }
  } else {
    res.status(400);
    res.send({error: "Provide game id OR twitch id"});
  }
};
