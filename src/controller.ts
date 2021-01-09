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
  getBarChart,
  getRanking,
  getRegionById,
  getRegions,
  getCasesByRegionId, 
  getLineChart, 
  getGameIGDB, 
  getGamesFromGenreIGDB, 
  getArtworkIGDB,
  getCoverIGDB,
  getExternalsIGDB,
  getTopRatedIGDB,
  getGameVideosIGDB,
  getGameReleasesIGDB,
  getGamePlatformsIGDB
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

//#endregion

//#region --- REGIONS and CASES ---

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

//#endregion

//#region --- LOCAL ELABORATIONS ---

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

//#endregion

//#region --- CHARTS ---

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
};

export const gameIGDB = async (req: Request, res: Response) => {
  const nameGame = getGameNameFromRequest(req);
  if(nameGame !== null){
    const game = await getGameIGDB(nameGame);
    if (!isError(game)) {
      res.contentType('json');
    }
    //maybe here i need to initialize the new type
    res.send(game)  
  }else{
    res.status(400);
    res.send({error: "Invalid name format"})
  }
}

export const genresIGDB = async (req: Request, res: Response) => {
  const genre = getStringFromRequest(req, "gameGenre");
  if(genre !== null){
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
  if(gameID !== null){
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
  if(gameID !== null){
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
  if(gameID !== null){
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
  if(gameID !== null){
    const gameVideos = await getGameVideosIGDB(gameID);
    if(!isError(gameVideos)){
      res.contentType() //Need a way to use mp4
    }
    res.send(gameVideos);
  }else{
    res.status(400);
    res.send({error: "Invalid ID"})
  }
}

export const releaseIGDB = async (req: Request, res: Response) => {
  const gameID = getIdFromRequest(req);
  if(gameID !== null){
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
  if(gameID !== null){
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
//#endregion
