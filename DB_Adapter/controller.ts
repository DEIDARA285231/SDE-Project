import { Request, Response } from 'express';
import {
  getIdFromRequest,
  getGameNameFromRequest,
  getStringFromRequest
} from './helper';

import ExternalDB from './models/Externals';
import User from './models/User';

//Find a game on the DB by either the id with which it is stored, or the name
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

//Find a user on the DB by the googleId with which it is stored
export const findUser = async (req: Request, res: Response) => {

  const userID = getStringFromRequest(req,"googleId");

  if(userID !== false){
    try {
      let user = await User.findOne({ googleId: userID })
      if (user) {
        res.send(user);
      }else {
        res.status(404);
        res.send({error: "Not found"})
      }
    } catch(e) {
      res.status(503);
      res.send({ error: 'Something bad happened. Error from the call to the Database' });
    }
  }else {
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

//Find and update a game on the DB by the id with which it is stored
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

//Find and update a user on the DB by the id with which it is stored
//access token passed as parameter since it is the param we update on the DB
export const findAndUpdateUser = async (req: Request, res: Response) => {
  const userID = getStringFromRequest(req,"userId");
  const accessToken = getStringFromRequest(req,"accessToken");

  if(userID !== false && accessToken !== false){
    try{
      const user = await User.findOneAndUpdate({ googleId: userID },{accessToken: accessToken})
      if (user) {
        res.send(user);
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

//Create a new user on the DB. Passed the data in the body
export const createUser = async (req: Request, res: Response) => {
  const newUser = req.body;

  if(newUser !== false){
    try{
      let user = await User.create(newUser)
      if (user) {
        res.send(user);
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
