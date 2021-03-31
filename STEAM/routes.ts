import express from 'express';
import {
  priceSteam,
  activePlayersSteam
} from './controller';

const router = express.Router();

/**
 * @route GET /price - Returns the price for a certain game on the Steam store
 * @group Steam - Endpoints regarding the Steam store
 * @param {BigInteger} id.query - ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the price listed for a certain game on the Steam store.
 * @returns {object} 503 - Something bad happened. Error from the call to the Database.
 * @returns {object} 400 - Invalid ID.
 * @returns {object} 404 - The game is not on Steam
 *
 */
router.get('/price', priceSteam);                   //SOLO ID DI IGDB -> OK

/**
 * @route GET /activePlayers - Returns the exact number of players for a certain game on the Steam store
 * @group Steam - Endpoints regarding the Steam store
 * @param {BigInteger} id.query - ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the exact number of players for a certain game on the Steam store.
 * @returns {object} 503 - Something bad happened. Error from the call to the Database.
 * @returns {object} 400 - Invalid ID.
 * @returns {object} 404 - The game is not on Steam
 *
 */
router.get('/activePlayers', activePlayersSteam);   //SOLO ID DI IGDB -> OK

export default router;
