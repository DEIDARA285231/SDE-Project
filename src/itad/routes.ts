import express from 'express';
import {
  plainITAD,
  getStoreLow
} from './controller';

const router = express.Router();

/**
 * @route GET /itad/getPlain - Returns the plain (ID) for "Is There Any Deal"
 * @group ITAD - Endpoints regarding "Is there any deal API"
 * @param {BigInteger} id.query - Steam ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the plain for a certain game.
 * @returns {object} 503 - Something bad happened. Error from the call to the Database.
 * @returns {object} 400 - Invalid ID.
 * @returns {object} 404 - The game is not on ITAD
 */
router.get('/plain', plainITAD);       //ID DI IGDB -> OK

/**
 * @route GET /itad/getStoreLow - Returns the lowest price for certain game
 * @group ITAD - Endpoints regarding "Is there any deal API"
 * @param {BigInteger} id.query - ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the historic lowest price for a certain game in stores Origin, Epic, Amazon US, Gog, Steam.
 * @returns {object} 503 - Something bad happened. Error from the call to the Database.
 * @returns {object} 400 - Invalid ID.
 * @returns {object} 404 - The game is not on ITAD or no prices found.
 */
router.get('/storeLow', getStoreLow);  //ID DI IGDB -> OK

export default router;
