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

import { isError } from './types';
import {
  getHello,
  getGameIGDB,
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

//#region --- EXAMPLE ---

export const hello = (req: Request, res: Response) => {
  // If in the URL (GET request) e.g. localhost:8080/?name=pippo
  const name = req.query['name'];

  // If in body of the request (as json or form-data)
  // const name = req.body['name'];

  // If in the URL as a parameter e.g. localhost:8080/pippo/ and route defined as '/:name'
  // const name = req.params['name'];

  if (name != null && typeof name === 'string') {
    res.send(getHello(name));
  } else {
    res.status(400);
    res.send({ error: 'Invalid name format!' });
  }
};

/*
export const regions = async (req: Request, res: Response) => {
  res.send(await getRegions());
};

export const regionById = async (req: Request, res: Response) => {
  const id = getIdFromRequest(req);
  if (id !== false) {
    res.send(await getRegionById(id));
  } else {
    res.status(400);
    res.send({ error: 'Invalid ID format!' });
  }
};

export const casesByRegionId = async (req: Request, res: Response) => {
  const id = getIdFromRequest(req);
  if (id !== false) {
    const date = getDateFromRequest(req);
    res.send(await getCasesByRegionId(id, date.year, date.month, date.day));
  } else {
    res.status(400);
    res.send({ error: 'Invalid ID format!' });
  }
};

export const ranking = async (req: Request, res: Response) => {
  const date = getDateFromRequest(req);
  let n = getNumberFromRequest(req, 'n');
  if (n === false) {
    n = 5;
  }
  let ord = req.query['ord'];
  if (ord !== 'asc') {
    ord = 'desc';
  }
  res.send(await getRanking(n, ord, date.year, date.month, date.day));
};

export const barChart = async (req: Request, res: Response) => {
  const date = getDateFromRequest(req);

  const chart = await getBarChart(date.year, date.month, date.day);
  if (!isError(chart)) {
    res.contentType('image/png');
  }
  res.send(chart);
};

export const lineChart = async (req: Request, res: Response) => {
  const id = getIdFromRequest(req);
  if (id !== false) {
    const date = getDateFromRequest(req);

    const chart = await getLineChart(id, date.year, date.month);
    if (!isError(chart)) {
      res.contentType('image/png');
    }
    res.send(chart);
  } else {
    res.status(400);
    res.send({ error: 'Invalid ID format!' });
  }
};*/

//IGDB

export const gameIGDB = async (req: Request, res: Response) => {
  const nameGame = getGameNameFromRequest(req);
  if(nameGame !== false){
    const game = await getGameIGDB(nameGame);
    if (!isError(game)) {
      res.contentType('json');
    }
    //maybe here i need to initialize the new type
    console.log(game);
    res.send(game)
  }else{
    res.status(400);
    res.send({error: "Invalid name format"})
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
    res.send(JSON.stringify(plain["data"][`app/${gameID}`]));
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
      res.send(JSON.stringify(storeLow["data"][plain][0].price));
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

export const priceSteam = async (req: Request, res: Response) => {
  const appID = getIdFromRequest(req);
  if (appID!==false) {
    try{
      const steamPrice = await getPriceSteam(appID);
      if (!isError(steamPrice)) {
        res.contentType('application/json');
      }
      let infoApp=steamPrice;
      let price=infoApp[appID.toString()].data["package_groups"][0].subs[0]["price_in_cents_with_discount"];
      res.send(JSON.stringify(price/100));
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
    res.send(JSON.stringify(steamPlayers["response"]["player_count"]));
  } else {
    res.sendStatus(400);
    res.send({ error: 'Invalid name format!' });
  }
};

//Twitch

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
  const gameID = getStringFromRequest(req,"gameID");
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/

  if(gameID!==false) {
    const streams = await getStreamsTwitch(true,gameID);
    res.send(streams);
  } else {
    const streams1 = await getStreamsTwitch(false,"");
    res.send(streams1);
  }
};

export const videosTwitch = async (req: Request, res: Response) => {
  const gameID = getStringFromRequest(req,"gameID");
  //const language = getStringFromRequest(req,"language"); /*no support for language selection yet*/

  if(gameID!==false) {
    const videos = await getVideosTwitch(gameID);
    res.send(videos);
  } else {
    res.status(400);
    res.send({error: "Invalid parameter"});
  }
};
