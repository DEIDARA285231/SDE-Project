import { Request, Response } from 'express';
import { isError } from './types';

import {
  getPriceSteam,
  getActivePlayersSteam} from './core';
import {
  getIdFromRequest,
} from './helper';

import axios from 'axios';
import config from './config'

//Steam

export const priceSteam = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if (gameID!==false) {
    try{
      let gameInDB = (await axios.get(`${config.DB_ADAPTER}/find`, {params: { id: gameID } })).data;

      if (gameInDB.steamId !== undefined){
        const steamPrice = await getPriceSteam(gameInDB.steamId);
        if(!isError(steamPrice)){
          let hoursHLTB = undefined;
          try{
            hoursHLTB = await axios({
              url: `${config.API_IGDB}/howlongtobeat`,
              method: 'GET',
              params: {
                name: gameInDB.gameName
              }
            });
          }catch(e){
            hoursHLTB = undefined;
          }
          
          let response = {}
  
          if (hoursHLTB !== undefined && hoursHLTB.data[0] !== undefined && hoursHLTB.data[0].timeLabels !== undefined){
            let sum = 0.0
            let timeLabels = hoursHLTB.data[0].timeLabels
            for(let i=0; i<(timeLabels.length); i++) {
              let currentLabel = timeLabels[i][0]
              sum += hoursHLTB.data[0][currentLabel]
            }
  
            let price = steamPrice[gameInDB.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
            let hoursPriceRatio = (sum/timeLabels.length)/price
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
      }else{
        res.status(404);
        res.send({error: "Game not on Steam"})
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
  
        if (responseExt.data.steamId !== undefined){
          const steamPrice = await getPriceSteam(responseExt.data.steamId);
          if(!isError(steamPrice)){
            let hoursHLTB = undefined;
            try{
              hoursHLTB = await axios({
                url: `${config.API_IGDB}/howlongtobeat`,
                method: 'GET',
                params: {
                  name: responseExt.data.gameName
                }
              });
            }catch(e){
              hoursHLTB = undefined;
            }
            
            let response = {}
    
            if (hoursHLTB !== undefined && hoursHLTB.data[0] !== undefined && hoursHLTB.data[0].timeLabels !== undefined){
              let sum = 0.0
              let timeLabels = hoursHLTB.data[0].timeLabels
              for(let i=0; i<(timeLabels.length); i++) {
                let currentLabel = timeLabels[i][0]
                sum += hoursHLTB.data[0][currentLabel]
              }
    
              let price = steamPrice[responseExt.data.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
              let hoursPriceRatio = (sum/timeLabels.length)/price
              let h = +(hoursPriceRatio.toFixed(2))
    
              response = {
                id: gameID,
                game_name: responseExt.data.gameName,
                price: price,
                hoursPrice: h
              }
            }else{
              let price = steamPrice[responseExt.data.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
    
              response = {
                id: gameID,
                game_name: responseExt.data.gameName,
                price: price
              }
            }
            res.send(response);
          }else{
            res.status(404);
            res.send({error: "Game not on Steam"})
          }
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }catch(e){
        res.status(404);
        res.send({error: "Game not on Steam"})
      }
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
      let gameInDB = (await axios.get(`${config.DB_ADAPTER}/find`, {params: { id: gameID } })).data;

      if (gameInDB.steamId !== undefined){
        const steamPlayers = await getActivePlayersSteam(gameInDB.steamId);
        if(!isError(steamPlayers)){
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
      }else{
        res.status(404);
        res.send({error: "Game not on Steam"})
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
        if (responseExt.data.steamId !== undefined){
          const steamPlayers = await getActivePlayersSteam(responseExt.data.steamId);
          if(!isError(steamPlayers)){
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
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }catch(e){
        res.status(404);
        res.send({error: "Game not on Steam"})
      }
    }
  }else {
    res.status(400);
    res.send({ error: 'Invalid ID' });
  }
};
