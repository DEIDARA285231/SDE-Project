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
 *
 */
router.get('/getPlain', plainITAD);       //ID DI IGDB -> OK

/**
 * @route GET /itad/getStoreLow - Returns the lowest price for certain game
 * @group ITAD - Endpoints regarding "Is there any deal API"
 * @param {BigInteger} id.query - Steam ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the lowest price for a certain game.
 *
 */
router.get('/getStoreLow', getStoreLow);  //ID DI IGDB -> OK

export default router;
