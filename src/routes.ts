/*********
 * Route definitions
 *   All the routes that you want to implement should be defined here!
 *   You should avoid to put code here: it's a better approach to call
 *   methods from the controllers in order to process the requests!
 *   In this way, here you can have a more organized way to check all
 *   your routes!
 *   In a huge project, you can define multiple routers in order to divide
 *   the endpoints in different files by the domain of their operation.
 */

import express from 'express';
import {
  gameIGDB,
  genresIGDB,
  coverIGDB,
  artworkIGDB,
  externalGameIGDB,
  topRatedIGDB,
  gameVideosIGDB,
  releaseIGDB,
  platformsIGDB,
  priceSteam,
  activePlayersSteam,
  gameTwitch,
  topGamesTwitch,
  searchTwitch,
  streamsTwitch,
  videosTwitch,
  gameSpeedrun,
  plainITAD,
  getStoreLow
} from './controller';

const Ninja = require("../modules/ninja");

const router = express.Router();

// Possible methods: .get, .post, .put, .patch, .delete

// To add URL parameters (Doable for any method! Not only for GET):
// router.get('/:parameter1/:parameter2', f);

//IGDB
router.get("/games", gameIGDB);   //param name
router.get("/game/genres", genresIGDB);
router.get("/game/artworks", artworkIGDB);
router.get("/game/covers", coverIGDB);
router.get("/game/externalGame", externalGameIGDB);
router.get("/games/topRated", topRatedIGDB);
router.get("/game/gameVideos", gameVideosIGDB);
router.get("/game/releaseDates", releaseIGDB);
router.get("/game/platforms", platformsIGDB);

//STEAM
router.get('/steam/price', priceSteam);
router.get('/steam/activePlayers', activePlayersSteam);

//ITAD
router.get('/itad/getPlain', plainITAD);
router.get('/itad/getStoreLow', getStoreLow);

//TWITCH
router.get('/twitch', gameTwitch);              //search game by param id or name
router.get('/twitch/topGames', topGamesTwitch); //default only 20 results
router.get('/twitch/search/', searchTwitch);    //search categories by param query
router.get('/twitch/streams/', streamsTwitch);  //search streams, either top overall or by (game)id param
router.get('/twitch/videos/', videosTwitch);    //search videos, either top overall or by (game)id param

//speedrun
router.get('/speedrun', gameSpeedrun);          //search game(s) by param id or name

router.post("/ninjas", function(req, res, next){
  Ninja.create(req.body).then(function(ninja:any){
    res.send(ninja);
  }).catch(next);
});
export default router;
