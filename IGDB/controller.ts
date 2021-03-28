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

import axios from 'axios';
import config from './config'
import { HowLongToBeatService } from 'howlongtobeat';

//retrieve data for a game from IGDB
export const gameIGDB = async (req: Request, res: Response) => {
  //get id param from request
  const gameID = getIdFromRequest(req);                         
  if(gameID !== false){
    try {
      //search if game already in our DB
      (await axios.get(`${config.DB_ADAPTER}/find`, {params: { id: gameID } })).data;
    } catch(e) {
      try{
        //if game not in DB we call externalGame to retrieve data from IGDB and fill DB
        await axios({
          url: `${config.API_IGDB}/game/externalGame`,
          method: 'GET',
          headers: {
            "Accept": "application/json",
          },
          params: {
            id: gameID
          }
        });
      }catch(e){
        //if externalGame perform no action, no further action needed
      }
    }
    //call IGDB with the ID
    const game = await getGameIGDBbyID(gameID);
    //check if IGDB returned an entry for the game
    if (!isError(game) && Object.keys(game).length > 0) {
      //game found, try to solve the genres
      if (game.genres !== undefined){
        let genreStructure=getGenres();
        for(let i=0;i<game.genres.length; i++){
          game.genres[i]=genreStructure[game.genres[i]].name;
        }
        //response updated with genres, now return the game data
        res.send(game);
      }else{
        //response not updated with genres, return the game data anyway
        res.send(game);
      }
    } else {
      //IGDB returned nothing, 404
      res.status(404);
      res.send({error: "No Games with the id found"})
    }
  } else {
    //if no id param, check for name
    const nameGameInserted = getGameNameFromRequest(req);
    if(nameGameInserted !== false){
      //if name param exists, call IGDB with the name
      let limit = getNumberFromRequest(req, "limit");
      let offset = getNumberFromRequest(req, "offset")
      limit = (limit !== false)? limit : 20;
      offset = (offset !== false)? offset : 0;
      const games = await getGameIGDB(nameGameInserted, limit, offset);
      if (!isError(games) && games.length > 0){
        //IGDB returned data for the game, return
        res.send(games)
      }else{
        //IGDB found no data for the game, 404
        res.status(404);
        res.send({error: "No Games with the name found"})
      }
    } else{
      //if no id nor name param, bad request. One param is needed
      res.status(400);
      res.send({error: "Numerical id or name param is needed"})
    }
  }
}

//retrieve genres for a game from IGDB
export const genresIGDB = async (req: Request, res: Response) => {
  //get id param from request
  const genreID = getIdFromRequest(req)
  if(genreID !== false){
    //if id specified, call IGDB with id param
    const genre = await getGenreFromIdIGDB(genreID);
    if(genre !== undefined) {
      //IGDB returned something, return
      res.send(genre);
    } else {
      //IGDB found nothing, 404
      res.status(404);
      res.send({error: "Genre with id not found"})
    }
  }else{
    //id not specified
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
    if (!isError(externalIds) && externalIds.length > 0) {
      let gameOK = true;
      for (let i=0; i<externalIds.length; i++){
        if(externalIds[i].game!==gameID){
          gameOK = false;
          break;
        }
      }

      if(gameOK){
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
          gameId: externalIds[0].game
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
            try{
              const responseExt = await axios({
                url: `${config.API_ITAD}/plain`,
                method: 'GET',
                params: {
                  id: externalIds[0].game,
                  steamId: newExternal.steamId
                }
              });
              if (responseExt.data.plain !== undefined){
                newExternal.itad_plain=responseExt.data.plain;
              }
            }catch(e){
              //no action needed
            }
          }
        }
  
        if (indexGog!==-1){
          newExternal.gogId=externalIds[indexGog]["uid"];
          if (newExternal.gameName === "Not Inserted")
            newExternal.gameName = externalIds[indexGog]["name"]
        }
  
        if(newExternal.gameName !== "Not Inserted") {
          try{
            let newInsertion = (await axios.post(`${config.DB_ADAPTER}/update`, newExternal, {params: { id: newExternal.gameId } })).data;
            res.status(200);
            res.send(newInsertion);
          }catch(e){
            res.status(500);
            res.send({error: "Insertion failed"})
          }
        } else {
          res.status(404);
          res.send({error: "The game does not appear on any external platform"})
        }
      }else{
        res.status(500);
        res.send({error: "Bad parsing from IGDB"})
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
          try{
            const responseExt = await axios({
              url: `${config.API_ITAD}/plain`,
              method: 'GET',
              params: {
                id: newExternal.gameId,
                steamId: newExternal.steamId
              }
            });
            if (responseExt.data.plain !== undefined){
              newExternal.itad_plain=responseExt.data.plain;
            }
          }catch(e){
            //no action needed
          }
        }
      }
      if (indexGog!==-1){
        newExternal.gogId=externalIds[indexGog]["uid"];
        if (newExternal.gameId === -1)
          newExternal.gameId = externalIds[indexGog]["game"]
      }

      if(newExternal.gameId !== -1) {
        try{
          let newInsertion = (await axios.post(`${config.DB_ADAPTER}/update`, newExternal, {params: { id: newExternal.gameId } })).data;
          res.status(200);
          res.send(newInsertion);
        }catch(e){
          res.status(500);
          res.send({error: "Insertion failed"})
        }
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
//ignora
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
//Error handling OK
export const howLongToBeat = async (req: Request, res: Response) => {
  let hltbService = new HowLongToBeatService();
  const gameName = getGameNameFromRequest(req);
  if(gameName !== false){
    hltbService.search(gameName).then(result => res.send(result)).catch(e => {
      res.status(404);
      res.send({error: "Not found"})
    });
  }else {
    res.status(400);
    res.send({error: "Invalid parameter"});
  }
};
