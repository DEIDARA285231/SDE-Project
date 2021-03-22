import express from 'express';
import { findAndUpdate, findByIDorName, findAndUpdateUser, findUser, createUser } from './controller';

const router = express.Router();

/**
 * @route GET /db/find - Finds a game on the DB"
 * @group DB - Endpoints regarding the DataBase used
 * @param {BigInteger} id.query - ID of the game we need to search
 * @param {String} name.query - Name of the game we need to search
 * @returns {object} 200 - Returns a json containing the plain for a certain game.
 * @returns {object} 400 - Invalid ID or Name.
 * @returns {object} 404 - Game not found on the DB.
 * @returns {object} 503 - Something bad happened. Error from the call to the Database.
 */
router.get('/find', findByIDorName);

/**
 * @route GET /db/finduser - Finds a user on the DB"
 * @group DB - Endpoints regarding the DataBase used
 * @param {BigInteger} id.query - ID of the user
 * @returns {object} 200 - Returns a json containing the plain for a certain game.
 * @returns {object} 400 - Invalid ID or Name.
 * @returns {object} 404 - Game not found on the DB.
 * @returns {object} 503 - Something bad happened. Error from the call to the Database.
 */
router.get('/finduser', findUser);

router.post('/update', findAndUpdate);

router.post('/updateuser', findAndUpdateUser);

router.post('/createuser', createUser);

export default router;
