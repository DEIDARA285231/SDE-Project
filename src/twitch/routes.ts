import express from 'express';
import {
  gameTwitch,
  topGamesTwitch,
  searchTwitch,
  streamsTwitch,
  videosTwitch
} from './controller';

const router = express.Router();

/**
 * @route GET /twitch/ - Returns twitch's page for a certain game
 * @group Twitch - Endpoints regarding the Twitch platform
 * @param {BigInteger} id.query - ID of the game we need to search
 * @param {BigInteger} id.query - twitch ID of the game we need to search
 * @param {String} name.query - Correct name of the game we need to search
 * @returns {object} 200 - Returns a json containing the data url for a certain game on the Twitch Platform.
 * @returns {object} 400 - Provide only game id, game name, or twitch id.
 * @returns {object} 404 - Game not broadcasted on twitch.
 * @returns {object} 503 - Something bad happened. Error from Twitch itself.
 *
 */
router.get('/', gameTwitch);

/**
 * @route GET /twitch/topGames - Returns twitch's most viewed games
 * @group Twitch - Endpoints regarding the Twitch platform
 * @returns {object} 200 - Returns a json containing the top 10 most viewed games on the Twitch Platform.
 *
 */
router.get('/topGames', topGamesTwitch);

/**
 * @route GET /twitch/search - Returns twitch's page for a certain category
 * @group Twitch - Endpoints regarding the Twitch platform
 * @param {String} query.query - Name of the category to search on Twitch's platform
 * @returns {object} 200 - Returns a json containing the url for a certain category on the Twitch Platform.
 *
 */
router.get('/search/', searchTwitch);

/**
 * @route GET /twitch/streams - Returns twitch's steams page for a certain game
 * @group Twitch - Endpoints regarding the Twitch platform
 * @param {BigInteger} id.query - Steam ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the url for the streams of a certain game on the Twitch.
 *
 */
router.get('/streams/', streamsTwitch);

/**
 * @route GET /twitch/videos - Returns twitch's videos for a certain game
 * @group Twitch - Endpoints regarding the Twitch platform
 * @param {BigInteger} id.query - Steam ID of the game we need to search
 * @returns {object} 200 - Returns a json containing the url for the videos for a certain game on the Twitch.
 *
 */
router.get('/videos/', videosTwitch);

export default router;
