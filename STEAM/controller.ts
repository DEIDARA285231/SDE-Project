import { Request, Response } from 'express';

import {
  getPriceSteam,
  getActivePlayersSteam} from './core';
import {
  getIdFromRequest,
} from './helper';

import ExternalDB from '../SDE-Project-DB/models/Externals';
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

          const hoursHLTB = await axios({
            url: "http://localhost:3000/api/howlongtobeat",
            method: 'GET',
            params: {
              name: gameInDB.gameName
            }
          });

          let response = {}

          if (hoursHLTB.data[0] !== undefined && hoursHLTB.data[0].timeLabels !== undefined){
            let simp = 0.0
            let timeLabels = hoursHLTB.data[0].timeLabels
            for(let i=0; i<(timeLabels.length); i++) {
              let currentLabel = timeLabels[i][0]
              simp += hoursHLTB.data[0][currentLabel]
            }

            let price = steamPrice[gameInDB.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
            let hoursPriceRatio = (simp/timeLabels.length)/price
            let h = +(hoursPriceRatio.toFixed(2))

            response = {
              id: gameID,
              game_name: gameInDB.gameName,
              price: price,
              hoursPrice: h
            }
          }else{
            let price = steamPrice[gameInDB.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100

            response = {
              id: gameID,
              game_name: gameInDB.gameName,
              price: price
            }
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

          const hoursHLTB = await axios({
            url: "http://localhost:3000/api/howlongtobeat",
            method: 'GET',
            params: {
              name: responseExt.data.gameName
            }
          });

          let response = {}

          if (hoursHLTB.data[0] !== undefined && hoursHLTB.data[0].timeLabels !== undefined){
            let simp = 0.0
            let timeLabels = hoursHLTB.data[0].timeLabels
            for(let i=0; i<(timeLabels.length); i++) {
              let currentLabel = timeLabels[i][0]
              simp += hoursHLTB.data[0][currentLabel]
            }

            let price = steamPrice[gameInDB.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
            let hoursPriceRatio = (simp/timeLabels.length)/price
            let h = +(hoursPriceRatio.toFixed(2))

            response = {
              id: gameID,
              game_name: gameInDB.gameName,
              price: price,
              hoursPrice: h
            }
          }else{
            let price = steamPrice[gameInDB.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100

            response = {
              id: gameID,
              game_name: gameInDB.gameName,
              price: price
            }
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
