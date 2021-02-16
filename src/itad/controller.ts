import { Request, Response } from 'express';

import { isError } from '../types';
import {
  itadGetPlain,
  itadStoreLow
} from './core';
import {
  getIdFromRequest,
  getStringFromRequest,
} from '../helper';

import ExternalDB from '../../models/Externals';
import axios from 'axios';

export const plainITAD = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });
      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.steamId !== undefined){
          const plain = await itadGetPlain(gameInDB.steamId);
          const response = {
            id: gameID,
            steamId: gameInDB.steamId,
            plain: plain["data"][`app/${gameID}`]
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on IsThereAnyDeal.com"})
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
          const plain = await itadGetPlain(responseExt.data.steamId);
          const response = {
            id: gameID,
            steamId: gameInDB.steamId,
            plain: plain["data"][`app/${gameID}`]
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on IsThereAnyDeal.com"})
        }
      }
    }catch(e){
      res.status(400);
      res.send({ error: 'Invalid!' });
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const getStoreLow = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  let storeSet = new Set(["amazonus", "origin", "epic", "steam", "gog"])
  let store = getStringFromRequest(req, "store");
  store = (storeSet.has(String(store))) ? String(store) : "steam";


  if(gameID !== false){
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });
      if (gameInDB) {
        if (gameInDB.itad_plain !== undefined){
          const storeLow = await itadStoreLow(gameInDB.itad_plain, store);
          if (storeLow["data"].length >0){
            const response = {
              id: gameID,
              plain: gameInDB.itad_plain,
              store: store,
              storeLowestPrice: storeLow["data"][gameInDB.itad_plain][0].price
            }
          res.send(response);
          }else{
            res.status(404);
            res.send({error: "Store Low Not Found"})
          }
        }else{
          res.status(404);
          res.send({error: "Game not on IsThereAnyDeal.com"})
        }
      }else {
        const responseExt = await axios({
          url: "http://localhost:3000/api/game/externalGame",
          method: 'GET',
          params: {
            id: gameID
          }
        });
        if (responseExt.data.itad_plain !== undefined){
          const storeLow = await itadStoreLow(responseExt.data.itad_plain, store);
          if (storeLow["data"].length >0){
            const response = {
              id: gameID,
              plain: responseExt.data.itad_plain,
              store: store,
              storeLowestPrice: storeLow["data"][responseExt.data.itad_plain][0].price
            }
          res.send(response);
          }else{
            res.status(404);
            res.send({error: "Store Low Not Found"})
          }
        }else{
          res.status(404);
          res.send({error: "Game not on IsThereAnyDeal.com"})
        }
      }
    }catch(e){
      res.status(400);
      res.send({ error: 'Invalid!' });
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}
