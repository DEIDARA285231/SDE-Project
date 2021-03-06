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
  const gameID = getIdFromRequest(req);
  if (gameID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });
      if (gameInDB) {
        
        if (gameInDB.steamId !== undefined){
          const steamPrice = await getPriceSteam(gameInDB.steamId);
          const response = {
            id: gameID,
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
            id: gameID
          }
        });

        if (responseExt.data.steamId !== undefined){
          const steamPrice = await getPriceSteam(responseExt.data.steamId);
          const response = {
            id: gameID,
            game_name: responseExt.data.gameName,
            price: steamPrice[responseExt.data.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened' });
    }
  }else {
    res.status(400);
    res.send({ error: 'Invalid ID' });
  }
};

export const activePlayersSteam = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if (gameID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });

      if (gameInDB) {
        
        if (gameInDB.steamId !== undefined){
          const steamPlayers = await getActivePlayersSteam(gameInDB.steamId);
          const response = {
            id: gameID,
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
            id: gameID
          }
        });
        if (responseExt.data.steamId !== undefined){
          const steamPlayers = await getActivePlayersSteam(responseExt.data.steamId);
          const response = {
            id: gameID,
            game_name: responseExt.data.gameName,
            activePlayers: steamPlayers["response"]["player_count"]
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened' });
    }
  }else {
    res.status(400);
    res.send({ error: 'Invalid ID' });
  }
};
