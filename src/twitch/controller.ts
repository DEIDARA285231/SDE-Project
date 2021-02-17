import { Request, Response } from 'express';

import { isError } from '../types';
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
} from '../helper';

import ExternalDB from '../../models/Externals';
import axios from 'axios';

//Ok, already returns exactly id, name and box_art_url
export const gameTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  const gameName = getGameNameFromRequest(req);
  if(gameID !== false && gameName !== false) {
    res.status(400);
    res.send({error: "Provide only game id OR game name"})
  } else {
    if(gameID !== false){
      try{
        let gameInDB = await ExternalDB.findOne({ gameId: gameID });

        if (gameInDB) {
          //c'è il gioco nel DB
          if (!isError(gameInDB)) {
            res.contentType('json');
          }
          if (gameInDB.twitchId !== undefined){
            const game = await getTwitchGameById(String(gameInDB.twitchId));
            res.send(game);
          }else{
            res.status(404);
            res.send({error: "Game not broadcasted on Twitch"})
          }
        }else {
          const responseExt = await axios({
            url: "http://localhost:3000/api/game/externalGame",
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
        res.status(400);
        res.send({ error: 'Invalid!' });
      }
    } else {
      if(gameName !== false) {
        try{
          let gameInDB = await ExternalDB.findOne({ gameName: gameName });
          if (gameInDB) {

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
                url: "http://localhost:3000/api/game/externalGame",
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
      } else {
        res.status(400);
        res.send({error: "No correct parameter specified"})
      }
    }
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
export const streamsTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/
  if(gameID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });

      if (gameInDB) {
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
          url: "http://localhost:3000/api/game/externalGame",
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
      res.status(400);
      res.send({ error: 'Invalid!' });
    }
  } else {

    const streams1 = await getStreamsTwitch(false,"");
    res.send(streams1);
  }
};

//OK
export const videosTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
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

  if(gameID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });

      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.twitchId !== undefined){
          res.send(await getVideosTwitch(String(gameInDB.twitchId), period, sort, type));
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }else {
        const responseExt = await axios({
          url: "http://localhost:3000/api/game/externalGame",
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
      res.status(400);
      res.send({ error: 'Error!' });
    }
  } else {
    res.status(400);
    res.send({error: "Invalid parameter"});
  }
};
