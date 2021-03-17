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

//Ok, already returns exactly id, name and box_art_url
//now accepts also twitch_id
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

        if (!isError(gameInDB)) {
          //c'è il gioco nel DB
          if (gameInDB.twitchId !== undefined){
            const game = await getTwitchGameById(String(gameInDB.twitchId));
            res.send(game);
          }else{
            res.status(404);
            res.send({error: "Game not broadcasted on Twitch"})
          }
        }else {
          const responseExt = await axios({
            url: `${config.API_IGDB}/game/externalGame`,
            method: 'GET',
            params: {
              id: gameID
            }
          });
          if (responseExt.data.twitchId !== undefined){
            const game = await getTwitchGameById(String(responseExt.data.twitchId));
            res.send(game);
          }else{
            res.status(404);
            res.send({error: "Game not broadcasted on Twitch"})
          }
        }
      }catch(e){
        res.status(503);
        res.send({ error: 'Something bad happened. Error from Twitch itself!' });
      }
  } else if(gameName !== false) {
      try{
        let gameInDB = (await axios.get(`${config.DB_ADAPTER}/find`, {params: { name: gameName } })).data;
        if (!isError(gameInDB)) {
          if (gameInDB.twitchId !== undefined){
            const game = await getTwitchGameById(String(gameInDB.twitchId));
            res.send(game);
          }else{
            res.status(404);
            res.send({error: "Game not broadcasted on Twitch"})
          }
        }else {
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
              res.contentType('json');
              if (game.data.length > 0){
                res.send(game.data)
              }else{
                res.status(404);
                res.send({error: "Game not broadcasted on Twitch"})
              }
            }
          }
        }
      }catch(e){
        res.status(400);
        res.send({ error: 'Something wrong in calling the DB' });
      }
  } else if (twitchID !== false) {
    try {
      const game = await getTwitchGameById(twitchID.toString());
      res.send(game);
    } catch(e) {
      res.status(503);
      res.send({error: "Something bad happened. Error from Twitch itself!"})
    }
  } else {
    res.status(400);
    res.send({error: "No correct parameter specified"})
  }
};

//Ok, already returns exactly id, name and box_art_url
export const topGamesTwitch = async (req: Request, res: Response) => {
  const topGames = await getTopGamesTwitch();
  res.send(topGames);
};

//OK
export const searchTwitch = async (req: Request, res: Response) => {
  const query = getStringFromRequest(req,"query");
  if(query !== false){
    const searchedGames = await getSearchTwitch(query);
    if(!isError(searchedGames)){
      res.contentType("json");
    }
    res.send(searchedGames);
  } else {
    res.status(400);
    res.send({error: "Invalid parameter"});
  }
};

//OK
//now accepts also twitch_id
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
      if (!isError(gameInDB)) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.twitchId !== undefined){
          const streams = await getStreamsTwitch(true, String(gameInDB.twitchId));
          res.send(streams);
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }else {
        const responseExt = await axios({
          url: `${config.API_IGDB}/game/externalGame`,
          method: 'GET',
          params: {
            id: gameID
          }
        });
        if (responseExt.data.twitchId !== undefined){
          const streams = await getStreamsTwitch(true, String(responseExt.data.twitchId));
          res.send(streams);
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened. Error from Twitch itself' });
    }
  } else if(twitchID) {
    const streams1 = await getStreamsTwitch(true,String(twitchID));
    res.send(streams1);
  } else{
    const streams2 = await getStreamsTwitch(false,"");
    res.send(streams2);
  }
};

//OK
//now accepts also twitch_id
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

      if (!isError(gameInDB)) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.twitchId !== undefined) {
          res.send(await getVideosTwitch(String(gameInDB.twitchId), period, sort, type));
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }else {
        const responseExt = await axios({
          url: `${config.API_IGDB}/game/externalGame`,
          method: 'GET',
          params: {
            id: gameID
          }
        });
        if (responseExt.data.twitchId !== undefined){
          res.send(await getVideosTwitch(String(responseExt.data.twitchId), period, sort, type));
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened. Error from Twitch itself' });
    }
  } else if(twitchID) {
    res.send(await getVideosTwitch(String(twitchID), period, sort, type));
  } else {
    res.status(400);
    res.send({error: "Provide game id OR twitch id"});
  }
};
