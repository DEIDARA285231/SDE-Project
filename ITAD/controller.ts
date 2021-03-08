import { Request, Response } from 'express';

import { isError, storeLowestPrice } from './types';
import {
  itadGetPlain,
  itadStoreLow
} from './core';
import {
  getIdFromRequest,
  getNumberFromRequest,
  getStringFromRequest,
} from './helper';

import ExternalDB from '../SDE-Project-DB/models/Externals';
import axios from 'axios';

export const plainITAD = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    //controllo se c'è anche uno steamId (proveniente da externalGames)
    const steamID=getNumberFromRequest(req, "steamId")
    if (steamID ===false){
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
        res.send({ error: 'Something bad happened. Error from the call to the Database' });
      }
    }else{
      const plain = await itadGetPlain(steamID);
      const response = {
        id: gameID,
        steamId: steamID,
        plain: plain["data"][`app/${steamID}`]
      }
      res.send(response);
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
        if (gameInDB.itad_plain !== undefined){
          const hoursHLTB = await axios({
            url: "http://localhost:3000/api/howlongtobeat",
            method: 'GET',
            params: {
              name: gameInDB.gameName
            }
          });

          const storeLow = await itadStoreLow(gameInDB.itad_plain);
          if (storeLow["data"][gameInDB.itad_plain].length >0){
            let stores: storeLowestPrice[] = [];
            if (hoursHLTB.data[0] !== undefined && hoursHLTB.data[0].timeLabels !== undefined){
              let timeLabels = hoursHLTB.data[0].timeLabels
              let somma = 0.0
              for(let i=0; i<(timeLabels.length); i++) {
                let currentLabel = timeLabels[i][0]
                somma += hoursHLTB.data[0][currentLabel]
              }
              let avg=somma/timeLabels.length;

              storeLow["data"][gameInDB.itad_plain].forEach((elem : any) =>{
                let lowestPrice=+((+(elem.price)).toFixed(2))
                let hoursPriceRatio=+((avg/lowestPrice).toFixed(2))
                stores.push({
                  storeName: String(elem.shop),
                  lowestPrice: lowestPrice,
                  hoursPerEuroRatio: hoursPriceRatio
                });
              })

            }else{
              storeLow["data"][gameInDB.itad_plain].forEach((elem : any) =>{
                stores.push({
                  storeName: String(elem.shop),
                  lowestPrice: +((+(elem.price)).toFixed(2))
                });
              })
            }

            if(stores !== undefined) {
              stores.sort((a,b)=>(a.lowestPrice>b.lowestPrice) ? 1 : ((b.lowestPrice>a.lowestPrice) ? -1 : 0))
            }

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
          const hoursHLTB = await axios({
            url: "http://localhost:3000/api/howlongtobeat",
            method: 'GET',
            params: {
              name: responseExt.data.gameName
            }
          });

          const storeLow = await itadStoreLow(responseExt.data.itad_plain);
          if (storeLow["data"][responseExt.data.itad_plain].length >0){
            let stores: storeLowestPrice[] = [];
            if (hoursHLTB.data[0] !== undefined && hoursHLTB.data[0].timeLabels !== undefined){
              let timeLabels = hoursHLTB.data[0].timeLabels
              let somma = 0.0
              for(let i=0; i<(timeLabels.length); i++) {
                let currentLabel = timeLabels[i][0]
                somma += hoursHLTB.data[0][currentLabel]
              }
              let avg=somma/timeLabels.length;
              storeLow["data"][responseExt.data.itad_plain].forEach((elem : any) =>{
                let lowestPrice=+((+(elem.price)).toFixed(2))
                let hoursPriceRatio=+((avg/lowestPrice).toFixed(2))
                stores.push({
                  storeName: String(elem.shop),
                  lowestPrice: lowestPrice,
                  hoursPerEuroRatio: hoursPriceRatio
                });
              })
            }else{
              storeLow["data"][gameInDB.itad_plain].forEach((elem : any) =>{
                stores.push({
                  storeName: String(elem.shop),
                  lowestPrice: +((+(elem.price)).toFixed(2))
                });
              })
            }
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
            res.status(404);
            res.send({error: "Game not on IsThereAnyDeal.com"})
        }
      }
    }catch(e){
      res.status(503);
      console.log(e)
      res.send({ error: 'Something bad happened' });
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}
