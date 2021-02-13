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
  itadStoreLow
} from './core';
import {
  getDateFromRequest,
  getGameNameFromRequest,
  getIdFromRequest,
  getNumberFromRequest,
  getStringFromRequest,
} from './helper';

const ExternalDB = require('../models/Externals')

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
          const externalIds=await getExternalsIGDB(game.id);
          let indexTwitch=-1, indexSteam=-1, indexGog=-1;
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
            gameName: game.name,
            gameId: game.id,
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
      res.contentType("image/png");
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
      res.contentType("image/png");
    }
    res.send(gameCover);
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const externalGameIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== false){
    const externalSites = await getExternalsIGDB(gameID);
    if(!isError(externalSites)){
      res.contentType("json");
    }
    res.send(externalSites);
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
    const plain = await itadGetPlain(gameID);
    if(!isError(plain)){
      res.contentType("json");
    }
    const response = {
      idSteam: gameID,
      plain: plain["data"][`app/${gameID}`]
    }
    res.send(response);
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const getStoreLow = async (req: Request, res: Response) => {
  const plain = getStringFromRequest(req, "plain");
  //amazonus, origin, epic, steam, gog -> struttura dati per contenerli?
  const store = getStringFromRequest(req, "store");
  if(plain !== false && store!=false){
    const storeLow = await itadStoreLow(plain, store);
    if(!isError(plain) && !isError(store)){
      res.contentType("json");
    }
    if (storeLow["data"].length >0){
      const response = {
        game: plain,
        store: store,
        storeLowestPrice: storeLow["data"][plain][0].price
      }
      res.send(response);
    }else{
      res.status(404);
      res.send({error: "Not Found"})
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
      const steamPrice = await getPriceSteam(appID);
      if (!isError(steamPrice)) {
        res.contentType('application/json');
      }
      
      const response = {
        idSteam: appID,
        price: steamPrice[appID.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"]
      }
      res.send(response);
    }catch(e){
      res.sendStatus(400);
      res.send({ error: 'Invalid!' });
    }

  } else {
    res.sendStatus(400);
    res.send({ error: 'Invalid name format!' });
  }
};

export const activePlayersSteam = async (req: Request, res: Response) => {
  const appID = getIdFromRequest(req);
  if (appID!==false) {
    const steamPlayers = await getActivePlayersSteam(appID);
    if (!isError(steamPlayers)) {
      res.contentType('application/json');
    }
    const response = {
      idSteam: appID,
      activePlayers: steamPlayers["response"]["player_count"]
    }
    res.send(response);
  } else {
    res.sendStatus(400);
    res.send({ error: 'Invalid name format!' });
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
      const game = await getTwitchGameById(gameID);
      if(!isError(game)){
        res.contentType("json");
      }
      res.send(game);
    } else {
      if(gameName !== false) {
        const game = await getTwitchGameByName(gameName);
        if(!isError(game)){
          res.contentType("json");
        }
        res.send(game);
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
  const gameID = getStringFromRequest(req,"id");
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/

  if(gameID!==false) {
    const streams = await getStreamsTwitch(true, gameID);
    res.send(streams);
  } else {
    const streams1 = await getStreamsTwitch(false,"");
    res.send(streams1);
  }
};

export const videosTwitch = async (req: Request, res: Response) => {
  const gameID = getStringFromRequest(req,"game_id");
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/

  if(gameID!==false) {
    //const videos = await getVideosTwitch(gameID);
    res.send(await getVideosTwitch(gameID));
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
