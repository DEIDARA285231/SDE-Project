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
  getGamesFromGenreIGDB,
  getArtworkIGDB,
  getCoverIGDB,
  getExternalsIGDB,
  getTopRatedIGDB,
  getGameVideosIGDB,
  getGameReleasesIGDB,
  getGamePlatformsIGDB,
  getPriceSteam,
  getActivePlayersSteam,
  getTwitchGameById,
  getTwitchGameByName,
  getTopGamesTwitch,
  getSearchTwitch,
  getStreamsTwitch,
  getVideosTwitch,
  getSpeedrunGameByName,
  itadGetPlain,
  itadStoreLow,
  getExternalsIGDBbyName
} from './core';
import {
  getDateFromRequest,
  getGameNameFromRequest,
  getIdFromRequest,
  getNumberFromRequest,
  getStringFromRequest,
} from './helper';

const ExternalDB = require('../models/Externals')
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
          res.send(game);
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
      res.send(game);
    }else{
      res.status(400);
      res.send({error: "Invalid name or ID format"})
    }

  }
}

export const genresIGDB = async (req: Request, res: Response) => {
  const genre = getStringFromRequest(req, "gameGenre");
  if(genre !== false){
    const games = await getGamesFromGenreIGDB(genre);
    if(!isError(games)){
      res.contentType("json");
    }
    res.send(games);
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

//Steam

export const priceSteam = async (req: Request, res: Response) => {
  const appID = getIdFromRequest(req);
  if (appID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: appID });

      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.steamId !== undefined){
          const steamPrice = await getPriceSteam(gameInDB.steamId);
          const response = {
            id: appID,
            game_name: gameInDB.gameName,
            price: steamPrice[gameInDB.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
        
      }else {
        const responseExt = await axios({
          url: "http://localhost:3000/api/game/externalGame",
          method: 'GET',
          params: {
            id: appID
          }
        });
        
        if (responseExt.data.steamId !== undefined){
          const steamPrice = await getPriceSteam(responseExt.data.steamId);
          const response = {
            id: appID,
            game_name: responseExt.data.gameName,
            price: steamPrice[responseExt.data.steamId.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]/100
          }
          if (!isError(steamPrice)) {
            res.contentType('json');
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }    
    }catch(e){
      res.status(400);
      res.send({ error: 'Invalid!' });
    }
  }else {
    res.status(400);
    res.send({ error: 'Invalid parameter!' });
  }
};

export const activePlayersSteam = async (req: Request, res: Response) => {
  const appID = getIdFromRequest(req);
  if (appID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: appID });

      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.steamId !== undefined){
          const steamPlayers = await getActivePlayersSteam(gameInDB.steamId);
          const response = {
            id: appID,
            game_name: gameInDB.gameName,
            activePlayers: steamPlayers["response"]["player_count"]
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }else {
        const responseExt = await axios({
          url: "http://localhost:3000/api/game/externalGame",
          method: 'GET',
          params: {
            id: appID
          }
        });
        if (responseExt.data.steamId !== undefined){
          const steamPlayers = await getActivePlayersSteam(responseExt.data.steamId);
          const response = {
            id: appID,
            game_name: responseExt.data.gameName,
            activePlayers: steamPlayers["response"]["player_count"]
          }
          if (!isError(steamPlayers)) {
            res.contentType('json');
          }
          res.send(response);
        }else{
          res.status(404);
          res.send({error: "Game not on Steam"})
        }
      }    
    }catch(e){
      res.status(400);
      res.send({ error: 'Invalid!' });
    }
  }else {
    res.status(400);
    res.send({ error: 'Invalid parameter!' });
  }
};

//Twitch
//Ok, already returns exactly id, name and box_art_url
export const gameTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  const gameName = getGameNameFromRequest(req);
  if(gameID !== false && gameName !== false) {
    res.status(400);
    res.send({error: "Provide only game id OR game name"})
  } else {
    if(gameID !== false){
      try{
        let gameInDB = await ExternalDB.findOne({ gameId: gameID });
  
        if (gameInDB) {
          //c'è il gioco nel DB
          if (!isError(gameInDB)) {
            res.contentType('json');
          }
          if (gameInDB.twitchId !== undefined){
            const game = await getTwitchGameById(String(gameInDB.twitchId));
            res.send(game);
          }else{
            res.status(404);
            res.send({error: "Game not broadcasted on Twitch"})
          }
        }else {
          const responseExt = await axios({
            url: "http://localhost:3000/api/game/externalGame",
            method: 'GET',
            params: {
              id: gameID
            }
          });
          if (responseExt.data.twitchId !== undefined){
            const game = await getTwitchGameById(String(responseExt.data.twitchId));
            res.send(game);
          }else{
            res.status(404);
            res.send({error: "Game not broadcasted on Twitch"})
          }
        }    
      }catch(e){
        res.status(400);
        res.send({ error: 'Invalid!' });
      }
    } else {
      if(gameName !== false) {
        try{
          let gameInDB = await ExternalDB.findOne({ gameName: gameName });
          if (gameInDB) {
                        
            if (gameInDB.twitchId !== undefined){
              const game = await getTwitchGameById(String(gameInDB.twitchId));
              res.send(game);
            }else{
              res.status(404);
              res.send({error: "Game not broadcasted on Twitch"})
            }
          }else {
            const responseExt = await axios({
              url: "http://localhost:3000/api/game/externalGame",
              method: 'GET',
              params: {
                name: gameName
              }
            });
            if (responseExt.data.twitchId !== undefined){
              const game = await getTwitchGameById(String(responseExt.data.twitchId));
              res.send(game);
            }else{
              res.status(404);
              res.send({error: "Game not broadcasted on Twitch"})
            }
          }    
        }catch(e){
          res.status(400);
          res.send({ error: 'Invalid!' });
        }
      } else {
        res.status(400);
        res.send({error: "Invalid parameter"})
      }
    }
  }
};

//Ok, already returns exactly id, name and box_art_url
export const topGamesTwitch = async (req: Request, res: Response) => {
  const topGames = await getTopGamesTwitch();
  res.send(topGames);
};

export const searchTwitch = async (req: Request, res: Response) => {
  const query = getStringFromRequest(req,"query");
  if(query !== false){
    const searchedGames = await getSearchTwitch(query);
    if(!isError(searchedGames)){
      res.contentType("json");
    }
    res.send(searchedGames);
  } else {
    res.status(400);
    res.send({error: "Invalid parameter"});
  }
};

export const streamsTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/
  if(gameID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });

      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.twitchId !== undefined){
          const streams = await getStreamsTwitch(String(gameInDB.twitchId));
          res.send(streams);
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }else {
        const responseExt = await axios({
          url: "http://localhost:3000/api/game/externalGame",
          method: 'GET',
          params: {
            id: gameID
          }
        });
        if (responseExt.data.twitchId !== undefined){
          const streams = await getStreamsTwitch(String(responseExt.data.twitchId));
          res.send(streams);
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }    
    }catch(e){
      res.status(400);
      res.send({ error: 'Invalid!' });
    }
  } else {
    //ricerca per nome
    //const streams1 = await getStreamsTwitch(false,"");
    //res.send(streams1);
  }
};

export const videosTwitch = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  let periodSet = new Set(["all", "day", "week", "month"])
  let period = getStringFromRequest(req, "period");
  period = (periodSet.has(String(period))) ? String(period) : "month";

  let sortSet = new Set(["time", "views"])
  let sort = getStringFromRequest(req, "sort");
  sort = (sortSet.has(String(sort))) ? String(sort) : "views";

  let typeSet = new Set(["all", "upload", "archive", "highlight"])
  let type = getStringFromRequest(req, "type");
  type = (typeSet.has(String(type))) ? String(type) : "all";
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/

  if(gameID!==false) {
    try{
      let gameInDB = await ExternalDB.findOne({ gameId: gameID });

      if (gameInDB) {
        //c'è il gioco nel DB
        if (!isError(gameInDB)) {
          res.contentType('json');
        }
        if (gameInDB.twitchId !== undefined){
          res.send(await getVideosTwitch(String(gameInDB.twitchId), period, sort, type));
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }else {
        const responseExt = await axios({
          url: "http://localhost:3000/api/game/externalGame",
          method: 'GET',
          params: {
            id: gameID
          }
        });
        if (responseExt.data.twitchId !== undefined){
          res.send(await getVideosTwitch(String(responseExt.data.twitchId), period, sort, type));
        }else{
          res.status(404);
          res.send({error: "Game not broadcasted on Twitch"})
        }
      }    
    }catch(e){
      res.status(400);
      res.send({ error: 'Error!' });
    }
  } else {
    res.status(400);
    res.send({error: "Invalid parameter"});
  }
};

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
