/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 *   In a huge project, you should have multiple controllers, divided
 *   by the domain of the operation.
 */

import { Request, Response } from 'express';

import { isError, Externals } from './types';
import {
  getGameIGDB,
  getGameIGDBbyID,
  getGenreFromIdIGDB,
  getArtworkIGDB,
  getCoverIGDB,
  getExternalsIGDB,
  getTopRatedIGDB,
  getGameVideosIGDB,
  getGameReleasesIGDB,
  getGamePlatformsIGDB,
  getSpeedrunGameByName,
  getExternalsIGDBbyName
} from './core';
import { itadGetPlain } from './itad/core';
import {
  getGameNameFromRequest,
  getIdFromRequest,
  getStringFromRequest,
} from './helper';

import ExternalDB from '../models/Externals';
import axios from 'axios';

//IGDB

export const gameIGDB = async (req: Request, res: Response) => {
  const nameGameInserted = getGameNameFromRequest(req);
  if(nameGameInserted !== false){
    try{
      let gameInDB = await ExternalDB.findOne({ gameName: nameGameInserted });

      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }

        const game = await getGameIGDBbyID(gameInDB.gameId);
        if (game.genres !== undefined){
          for(let i=0;i<game.genres.length; i++){
            const responseGenre = await axios({
              url: "http://localhost:3000/api/game/genres",
              method: 'GET',
              headers: {
                "Accept": "application/json",
              },
              params: {
                id: game.genres[i]
              }
            })
            game.genres[i]=responseGenre.data["name"]
          }
          res.send(game);
        }
        res.send(game);
      }else {
        //non c'è il gioco nel DB
        const game = await getGameIGDB(nameGameInserted);
        if (game !==(undefined)){
          await axios({
            url: "http://localhost:3000/api/game/externalGame",
            method: 'GET',
            headers: {
              "Accept": "application/json",
            },
            params: {
              id: game.id
            }
          });
          if (game.genres !== undefined){
            for(let i=0;i<game.genres.length; i++){
              const responseGenre = await axios({
                url: "http://localhost:3000/api/game/genres",
                method: 'GET',
                headers: {
                  "Accept": "application/json",
                },
                params: {
                  id: game.genres[i]
                }
              })
              game.genres[i]=responseGenre.data["name"]
            }
            res.send(game);
          }
        }else{
          res.status(404);
          res.send({error: "Game not found"})
        }
      }
    }catch (err) {
      console.error(err)
    }

  }else{
    const gameID = getIdFromRequest(req);
    if(gameID !== false){
      const game = await getGameIGDBbyID(gameID);
      if (!isError(game)) {
        res.contentType('json');
      }
      if (game.genres !== undefined){
        for(let i=0;i<game.genres.length; i++){
          const responseGenre = await axios({
            url: "http://localhost:3000/api/game/genres",
            method: 'GET',
            headers: {
              "Accept": "application/json",
            },
            params: {
              id: game.genres[i]
            }
          })
          game.genres[i]=responseGenre.data["name"]
        }
        res.send(game);
      }
      res.send(game);
    }else{
      res.status(400);
      res.send({error: "Invalid name or ID format"})
    }

  }
}

export const genresIGDB = async (req: Request, res: Response) => {
  const genreID = getIdFromRequest(req)
  if(genreID !== false){
    const genre = await getGenreFromIdIGDB(genreID);
    if(!isError(genre)){
      res.contentType("json");
    }
    res.send(genre);
  }else{
    res.status(400);
    res.send({error: "Invalid genre"})
  }
}

export const artworkIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const gameArtwork = await getArtworkIGDB(gameID);
    if(!isError(gameArtwork)){
      res.contentType("json");
    }
    res.send(gameArtwork);
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const coverIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const gameCover = await getCoverIGDB(gameID);
    if(!isError(gameCover)){
      res.contentType("json");
    }
    res.send(gameCover);
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const externalGameIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  const name = getGameNameFromRequest(req)
  if(gameID !== false){
    const externalIds=await getExternalsIGDB(gameID);
    let indexTwitch=-1, indexSteam=-1, indexGog=-1;
    if (externalIds.length > 0){
      for (let i=0; i<externalIds.length; i++){
        if (externalIds[i].category===14){
          indexTwitch=i;
        }else if(externalIds[i].category===1){
          indexSteam=i;
        }else if(externalIds[i].category===5){
          indexGog=i;
        }
      }
      const newExternal: Externals = {
        gameName: externalIds[indexTwitch]["name"],
        gameId: gameID,
        twitchId: externalIds[indexTwitch]["uid"]
      }
      if (indexSteam!==-1){
        newExternal.steamId=externalIds[indexSteam]["uid"];
        if (newExternal.steamId !==undefined){
          const responseItad = await itadGetPlain(newExternal.steamId);
          newExternal.itad_plain=responseItad["data"][`app/${newExternal.steamId}`];
        }
      }
      if (indexGog!==-1){
        newExternal.gogId=externalIds[indexGog]["uid"];
      }
      await ExternalDB.create(newExternal);
      res.send(newExternal);
    }else{
      res.status(400);
      res.send({error: "Invalid ID"})
    }
  }else if(name !== false) {
    const externalIds=await getExternalsIGDBbyName(name);
    let indexTwitch=-1, indexSteam=-1, indexGog=-1;
    if (externalIds.length > 0){
      for (let i=0; i<externalIds.length; i++){
        if (externalIds[i].category===14){
          indexTwitch=i;
        }else if(externalIds[i].category===1){
          indexSteam=i;
        }else if(externalIds[i].category===5){
          indexGog=i;
        }
      }
      const newExternal: Externals = {
        gameName: name,
        gameId: externalIds[indexTwitch]["game"],
        twitchId: externalIds[indexTwitch]["uid"]
      }
      if (indexSteam!==-1){
        newExternal.steamId=externalIds[indexSteam]["uid"];
        if (newExternal.steamId !==undefined){
          const responseItad = await itadGetPlain(newExternal.steamId);
          newExternal.itad_plain=responseItad["data"][`app/${newExternal.steamId}`];
        }
      }
      if (indexGog!==-1){
        newExternal.gogId=externalIds[indexGog]["uid"];
      }
      await ExternalDB.create(newExternal);
      res.send(newExternal);
    }else{
      res.status(400);
      res.send({error: "Invalid ID"})
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const topRatedIGDB = async (req: Request, res: Response) => {
  const topRated = await getTopRatedIGDB();
  /*for (let entry=0; entry < topRated.length; entry++){
    if (topRated[entry].genres !== undefined){
      for(let i=0;i<topRated[entry].genres.length; i++){
        const responseGenre = await axios({
          url: "http://localhost:3000/api/game/genres",
          method: 'GET',
          headers: {
            "Accept": "application/json",
          },
          params: {
            id: topRated[entry].genres[i]
          }
        })
        topRated[entry].genres[i]=responseGenre.data["name"]
      }
    }
  }*/

  if(!isError(topRated)){
    res.contentType("json");
  }
  res.send(topRated);
}

export const gameVideosIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const gameVideos = await getGameVideosIGDB(gameID);
    if(!isError(gameVideos)){
      res.contentType('json') //Need a way to use mp4
    }
    res.send(gameVideos);
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const releaseIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const gameReleases = await getGameReleasesIGDB(gameID);
    if(!isError(gameReleases)){
      res.contentType("json");
    }
    res.send(gameReleases);
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const platformsIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const gamePlatforms = await getGamePlatformsIGDB(gameID);
    if(!isError(gamePlatforms)){
      res.contentType("json");
    }
    res.send(gamePlatforms);
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const gameSpeedrun = async (req: Request, res: Response) => {
  const gameID = getStringFromRequest(req,"name");
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/

  if(gameID!==false) {
    //const videos = await getVideosTwitch(gameID);
    res.send(await getSpeedrunGameByName(gameID));
  } else {
    res.status(400);
    res.send({error: "Invalid parameter"});
  }
};
