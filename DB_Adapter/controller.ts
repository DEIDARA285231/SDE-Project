import { Request, Response } from 'express';
import {
  getIdFromRequest,
  getGameNameFromRequest
} from './helper';


import ExternalDB from './models/Externals';

export const findByIDorName = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  const gameName = getGameNameFromRequest(req);
  if(gameID !== false){
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });
      if (gameInDB) {
        //c'è il gioco nel DB
        res.send(gameInDB);
      }else {
        res.status(404);
        res.send({error: "Not found"})
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened. Error from the call to the Database' });
    }
  }else if(gameName !== false){
    try{
      let gameInDB = await ExternalDB.findOne({ gameName: gameName });
      if (gameInDB) {
        //c'è il gioco nel DB
        res.send(gameInDB);
      }else {
        res.status(404);
        res.send({error: "Not found"})
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened. Error from the call to the Database' });
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID or Name"})
  }
}

export const findAndUpdate = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  //req.body
  if(gameID !== false){
    try{
      let requestObject = req.body.json
      let options = {upsert: true, new: true, setDefaultsOnInsert: true};
      let document = await ExternalDB.findOneAndUpdate({gameId:gameID},requestObject,options);
      if (document) {
        res.send(document);
      }else {
        res.status(404);
        res.send({error: "Not found"})
      }
    }catch(e){
      res.status(503);
      res.send({ error: 'Something bad happened. Error from the call to the Database' });
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}
