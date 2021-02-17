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
  getGenres,
  getNumberFromRequest
} from './helper';

import ExternalDB from '../models/Externals';
import axios from 'axios';

//IGDB

export const gameIGDB = async (req: Request, res: Response) => {
  const nameGameInserted = getGameNameFromRequest(req);
  if(nameGameInserted !== false){
    let limit = getNumberFromRequest(req, "limit");
    let offset = getNumberFromRequest(req, "offset")
    limit = (limit !== false)? limit : 20;
    offset = (offset !== false)? offset : 0;
    //non c'è il gioco nel DB
    const games = await getGameIGDB(nameGameInserted, limit, offset);
    if (!isError(games) && games !==(undefined)){
      let genreStructure=getGenres();
      for (let i=0; i< games.length; i++){
        if (games[i].genres !== undefined){
          for(let j=0;j<games[i].genres.length; j++){
            games[i].genres[j]=genreStructure[games[i].genres[j]].name;
          }
        }
      }
      res.send(games)
    }else{
      res.status(404);
      res.send({error: "No Games with the name found"})
    }
  }else{
    const gameID = getIdFromRequest(req);
    if(gameID !== false){
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });
      if (!(gameInDB)){
        await axios({
          url: "http://localhost:3000/api/game/externalGame",
          method: 'GET',
          headers: {
            "Accept": "application/json",
          },
          params: {
            id: gameID
          }
        });
      }
      const game = await getGameIGDBbyID(gameID);
      if (!isError(game)) {
        if (game.genres !== undefined){
          let genreStructure=getGenres();
          for(let i=0;i<game.genres.length; i++){
            game.genres[i]=genreStructure[game.genres[i]].name;
          }
          res.send(game);
        }else{
          res.send(game);
        }
      }
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
        gameName: "Not Inserted",
        gameId: gameID
      }
      if (indexTwitch!==-1){
        newExternal.twitchId=externalIds[indexTwitch]["uid"];
        newExternal.gameName=externalIds[indexTwitch]["name"];
      }
      if (indexSteam!==-1){
        newExternal.steamId=externalIds[indexSteam]["uid"];
        if (newExternal.gameName === "Not Inserted")
          newExternal.gameName = externalIds[indexSteam]["name"]
        if (newExternal.steamId !==undefined){
          const responseItad = await itadGetPlain(newExternal.steamId);
          newExternal.itad_plain=responseItad["data"][`app/${newExternal.steamId}`];
        }
      }
      if (indexGog!==-1){
        newExternal.gogId=externalIds[indexGog]["uid"];
        if (newExternal.gameName === "Not Inserted")
          newExternal.gameName = externalIds[indexGog]["name"]
      }
      await ExternalDB.create(newExternal);
      res.send(newExternal);
    }else{
      //CHANGE
      res.status(200);
      res.send({error: "ID does not appear in external sources"})
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
        gameId: -1
      }
      if (indexTwitch!==-1){
        newExternal.twitchId=externalIds[indexTwitch]["uid"];
        newExternal.gameId=externalIds[indexTwitch]["game"];
      }
      if (indexSteam!==-1){
        newExternal.steamId=externalIds[indexSteam]["uid"];
        if (newExternal.gameId === -1)
          newExternal.gameId = externalIds[indexSteam]["game"]
        if (newExternal.steamId !==undefined){
          const responseItad = await itadGetPlain(newExternal.steamId);
          newExternal.itad_plain=responseItad["data"][`app/${newExternal.steamId}`];
        }
      }
      if (indexGog!==-1){
        newExternal.gogId=externalIds[indexGog]["uid"];
        if (newExternal.gameId === -1)
          newExternal.gameId = externalIds[indexGog]["game"]
      }
      await ExternalDB.create(newExternal);
      res.send(newExternal);
    }else{
      res.status(404);
      res.send({error: "No Externals for the game with the name Specified"})
    }
  }else{
    res.status(400);
    res.send({error: "No parameters specified"})
  }
}

export const topRatedIGDB = async (req: Request, res: Response) => {
  const topRated = await getTopRatedIGDB();

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
