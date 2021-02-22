import express from 'express';
import {
  priceSteam,
  activePlayersSteam
} from './controller';

const router = express.Router();

/**
 * @route GET /steam/price - Returns the price for a certain game on the Steam store
 * @group Steam - Endpoints regarding the Steam store
 * @param {BigInteger} id.query.required - Steam ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the price listed for a certain game on the Steam store.
 *
 */
router.get('/price', priceSteam);                   //SOLO ID DI IGDB -> OK

/**
 * @route GET /steam/activePlayers - Returns the exact number of players for a certain game on the Steam store
 * @group Steam - Endpoints regarding the Steam store
 * @param {BigInteger} id.query.required - Steam ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the exact number of players for a certain game on the Steam store.
 *
 */
router.get('/activePlayers', activePlayersSteam);   //SOLO ID DI IGDB -> OK

export default router;
