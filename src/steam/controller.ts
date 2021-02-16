import { Request, Response } from 'express';

import { isError } from '../types';
import {
  getPriceSteam,
  getActivePlayersSteam} from './core';
import {
  getIdFromRequest,
} from '../helper';

import ExternalDB from '../../models/Externals';
import axios from 'axios';

//Steam

export const priceSteam = async (req: Request, res: Response) => {
  const appID = getIdFromRequest(req);
  if (appID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: appID });

      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.steamId !== undefined){
          const steamPrice = await getPriceSteam(gameInDB.steamId);
          const response = {
            id: appID,
            game_name: gameInDB.gameName,
            price: steamPrice[gameInDB.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }

      }else {
        const responseExt = await axios({
          url: "http://localhost:3000/api/game/externalGame",
          method: 'GET',
          params: {
            id: appID
          }
        });

        if (responseExt.data.steamId !== undefined){
          const steamPrice = await getPriceSteam(responseExt.data.steamId);
          const response = {
            id: appID,
            game_name: responseExt.data.gameName,
            price: steamPrice[responseExt.data.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
          }
          if (!isError(steamPrice)) {
            res.contentType('json');
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }
    }catch(e){
      res.status(400);
      res.send({ error: 'Invalid!' });
    }
  }else {
    res.status(400);
    res.send({ error: 'Invalid parameter!' });
  }
};

export const activePlayersSteam = async (req: Request, res: Response) => {
  const appID = getIdFromRequest(req);
  if (appID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: appID });

      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.steamId !== undefined){
          const steamPlayers = await getActivePlayersSteam(gameInDB.steamId);
          const response = {
            id: appID,
            game_name: gameInDB.gameName,
            activePlayers: steamPlayers["response"]["player_count"]
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }else {
        const responseExt = await axios({
          url: "http://localhost:3000/api/game/externalGame",
          method: 'GET',
          params: {
            id: appID
          }
        });
        if (responseExt.data.steamId !== undefined){
          const steamPlayers = await getActivePlayersSteam(responseExt.data.steamId);
          const response = {
            id: appID,
            game_name: responseExt.data.gameName,
            activePlayers: steamPlayers["response"]["player_count"]
          }
          if (!isError(steamPlayers)) {
            res.contentType('json');
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }
    }catch(e){
      res.status(400);
      res.send({ error: 'Invalid!' });
    }
  }else {
    res.status(400);
    res.send({ error: 'Invalid parameter!' });
  }
};
