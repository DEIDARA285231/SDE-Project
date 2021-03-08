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
  getPlatformsIGDB,
  getSpeedrunGameByName,
  getExternalsIGDBbyName,
  getGamePlatformsLogoIGDB
} from './core';
import {
  getGameNameFromRequest,
  getIdFromRequest,
  getStringFromRequest,
  getGenres,
  getNumberFromRequest
} from './helper';

import ExternalDB from '../SDE-Project-DB/models/Externals';
import axios from 'axios';
import { HowLongToBeatService } from 'howlongtobeat';

//error handling OK
export const gameIGDB = async (req: Request, res: Response) => {
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
      if(Object.keys(game).length > 0) {
        if (game.genres !== undefined){
          let genreStructure=getGenres();
          for(let i=0;i<game.genres.length; i++){
            game.genres[i]=genreStructure[game.genres[i]].name;
          }
          res.send(game);
        }else{
          res.send(game);
        }
      } else {
        res.status(404);
        res.send({error: "No Games with the id found"})
      }
    }
  } else {
    const nameGameInserted = getGameNameFromRequest(req);
    if(nameGameInserted !== false){
      let limit = getNumberFromRequest(req, "limit");
      let offset = getNumberFromRequest(req, "offset")
      limit = (limit !== false)? limit : 20;
      offset = (offset !== false)? offset : 0;
      const games = await getGameIGDB(nameGameInserted, limit, offset);
      if (!isError(games) && games.length > 0){
        res.send(games)
      }else{
        res.status(404);
        res.send({error: "No Games with the name found"})
      }
    } else{
      res.status(400);
      res.send({error: "Numerical id or name param is needed"})
    }
  }
}
//error handling OK
export const genresIGDB = async (req: Request, res: Response) => {
  const genreID = getIdFromRequest(req)
  if(genreID !== false){
    const genre = await getGenreFromIdIGDB(genreID);

    if(genre !== undefined) {
      res.send(genre);
    } else {
      res.status(404);
      res.send({error: "Genre with id not found"})
    }
  }else{
    res.status(400);
    res.send({error: "Invalid genre"})
  }
}
//error handling OK
export const artworkIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const gameArtwork = await getArtworkIGDB(gameID);
    if(!isError(gameArtwork)){
      if(gameArtwork.length > 0) {
        res.send(gameArtwork);
      } else {
        res.status(404);
        res.send({error: "No Artwork was found"})
      }
    } else {
      res.status(503);
      res.send({error: "Something bad happened"})
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}
//error handling OK
export const coverIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const gameCover = await getCoverIGDB(gameID);
    if(!isError(gameCover)){
      if(gameCover.length > 0) {
        res.send(gameCover);
      } else {
        res.status(404);
        res.send({error: "No Cover was found"})
      }
    } else {
      res.status(503);
      res.send({error: "Something bad happened"})
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}
//error handling OK
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
          const responseExt = await axios({
            url: "http://localhost:3000/api/itad/plain",
            method: 'GET',
            params: {
              id: gameID,
              steamId: newExternal.steamId
            }
          });
          if (responseExt.data.plain !== undefined){
            newExternal.itad_plain=responseExt.data.plain;
          }
        }
      }

      if (indexGog!==-1){
        newExternal.gogId=externalIds[indexGog]["uid"];
        if (newExternal.gameName === "Not Inserted")
          newExternal.gameName = externalIds[indexGog]["name"]
      }

      if(newExternal.gameName !== "Not Inserted") {
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        await ExternalDB.findOneAndUpdate({gameId:newExternal.gameId},newExternal,options);
        res.send(newExternal);
      } else {
        res.status(404);
        res.send({error: "The game does not appear on any external platform"})
      }
    } else {
      res.sendStatus(204);
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
          const responseExt = await axios({
            url: "http://localhost:3000/api/itad/plain",
            method: 'GET',
            params: {
              id: gameID,
              steamId: newExternal.steamId
            }
          });
          if (responseExt.data.plain !== undefined){
            newExternal.itad_plain=responseExt.data.plain;
          }
        }
      }
      if (indexGog!==-1){
        newExternal.gogId=externalIds[indexGog]["uid"];
        if (newExternal.gameId === -1)
          newExternal.gameId = externalIds[indexGog]["game"]
      }

      if(newExternal.gameId !== -1) {
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        await ExternalDB.findOneAndUpdate({gameId:newExternal.gameId},newExternal,options);
        res.send(newExternal);
      } else {
        res.status(404);
        res.send({error: "The game does not appear on any external platform"})
      }
    }else{
      res.sendStatus(204);
    }
  }else{
    res.status(400);
    res.send({error: "No parameters specified. Numerical id or name is needed"})
  }
}
//error handling OK
export const topRatedIGDB = async (req: Request, res: Response) => {
  const topRated = await getTopRatedIGDB();

  if(!isError(topRated)){
    res.send(topRated);
  }else{
    res.status(503);
    res.send({error: "Something bad happened"})
  }
}
//error handling OK
export const gameVideosIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const gameVideos = await getGameVideosIGDB(gameID);
    if(!isError(gameVideos)){
      if(gameVideos.length > 0) {
        res.send(gameVideos);
      } else {
        res.status(404);
        res.send({error: "No video was found"})
      }
    }else{
      res.status(503);
      res.send({error: "Something bad happened"})
    }
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}
//error handling OK
export const platformsIGDB = async (req: Request, res: Response) => {
  const platformID = getIdFromRequest(req);
  if(platformID !== false){
    const gamePlatforms = await getPlatformsIGDB(platformID);
    if(!isError(gamePlatforms)){
      if(Object.keys(gamePlatforms).length > 0) {
        const platLogo=await getGamePlatformsLogoIGDB(parseInt(gamePlatforms.platform_logo_url));
        if(!isError(platLogo) && platLogo["url"] !== undefined){
          gamePlatforms.platform_logo_url=platLogo["url"]
          res.send(gamePlatforms)
        }else{
          gamePlatforms.platform_logo_url="Not found"
          res.send(gamePlatforms)
        }
      }else{
        res.status(404);
        res.send({error: "No platform found"})
      }
    }else{
      res.status(503)
      res.send({error: "Something bad happened"})
    }
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

export const howLongToBeat = async (req: Request, res: Response) => {
  let hltbService = new HowLongToBeatService();
  const gameName = getGameNameFromRequest(req);
  if(gameName !== false){
    hltbService.search(gameName).then(result => res.send(result));
  }
};
