import { Request, Response } from 'express';

import { isError, storeLowestPrice } from '../types';
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
        if (gameInDB.steamId !== undefined){
          const plain = await itadGetPlain(gameInDB.steamId);
          const response = {
            id: gameID,
            steamId: gameInDB.steamId,
            plain: plain["data"][`app/${gameInDB.steamId}`]
          }
          let options = {upsert: true, new: true, setDefaultsOnInsert: true};
          let toUpdate = {itad_plain: response.plain}
          await ExternalDB.findOneAndUpdate({gameId:gameInDB.gameId},toUpdate,options);
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
            id: gameID,
            fromItad: true
          }
        });
        if (responseExt.data.steamId !== undefined){
          const plain = await itadGetPlain(responseExt.data.steamId);

          const response = {
            id: gameID,
            steamId: responseExt.data.steamId,
            plain: plain["data"][`app/${responseExt.data.steamId}`]
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on IsThereAnyDeal.com"})
        }
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened' });
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const getStoreLow = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);

  if(gameID !== false){
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });
      if (gameInDB) {

        const hoursHLTB = await axios({
          url: "http://localhost:3000/api/howlongtobeat",
          method: 'GET',
          params: {
            name: gameInDB.gameName
          }
        });

        let timeLabels = hoursHLTB.data[0].timeLabels
        let simp = 0.0

        for(let i=0; i<(timeLabels.length); i++) {
          let currentLabel = timeLabels[i][0]
          simp += hoursHLTB.data[0][currentLabel]
        }

        if (gameInDB.itad_plain !== undefined){
          const storeLow = await itadStoreLow(gameInDB.itad_plain);
          if (storeLow["data"][gameInDB.itad_plain].length >0){
            let stores: storeLowestPrice[] = [];
            storeLow["data"][gameInDB.itad_plain].forEach((elem : any) =>{
              stores.push({
                storeName: String(elem.shop),
                lowestPrice: +((+(elem.price)).toFixed(2))
              });
            })
            const response = {
              id: gameID,
              plain: gameInDB.itad_plain,
              stores: stores
            }
          res.send(response);
          }else{
            res.status(404);
            res.send({error: "Lowest prices Not Found"})
          }
        }else{
          //controllare ci sia comunque
          const responsed = await itadGetPlain(gameInDB.steamId);
          let plain = responsed["data"][`app/${gameInDB.steamId}`]
          if (plain && plain !== undefined){
            const storeLow = await itadStoreLow(plain);
            if (storeLow["data"][plain].length >0){
              let stores: storeLowestPrice[] = [];
              storeLow["data"][plain].forEach((elem : any) =>{
                stores.push({
                  storeName: String(elem.shop),
                  lowestPrice: +((+(elem.price)).toFixed(2))
                });
              })
              const response = {
                id: gameID,
                plain: plain,
                stores: stores
              }
              res.send(response);
            }else{
              res.status(404);
              res.send({error: "Lowest prices not Found"})
            }
          }else{
            res.status(404);
            res.send({error: "Game not on IsThereAnyDeal.com"})
          }
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
          const storeLow = await itadStoreLow(responseExt.data.itad_plain);
          if (storeLow["data"][responseExt.data.itad_plain].length >0){
            let stores: storeLowestPrice[] = [];
            storeLow["data"][responseExt.data.itad_plain].forEach((elem : any) =>{
              stores.push({
                storeName: String(elem.shop),
                lowestPrice: +((+(elem.price)).toFixed(2))
              });
            })
            const response = {
              id: gameID,
              plain: responseExt.data.itad_plain,
              stores: stores
            }
            res.send(response);
          }else{
            res.status(404);
            res.send({error: "Lowest prices not Found"})
          }
        }else{
          //controllare ci sia comunque
          const responsed = await itadGetPlain(responseExt.data.steamId);
          let plain = responsed["data"][`app/${responseExt.data.steamId}`]
          if (plain && plain !== undefined){
            const storeLow = await itadStoreLow(plain);
            if (storeLow["data"][plain].length >0){
              let stores: storeLowestPrice[] = [];
              storeLow["data"][plain].forEach((elem : any) =>{
                stores.push({
                  storeName: String(elem.shop),
                  lowestPrice: +((+(elem.price)).toFixed(2))
                });
              })
              const response = {
                id: gameID,
                plain: plain,
                stores: stores
              }
              res.send(response);
            }else{
              res.status(404);
              res.send({error: "Lowest prices not Found"})
            }
          }else{
            res.status(404);
            res.send({error: "Game not on IsThereAnyDeal.com"})
          }
        }
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened' });
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}
