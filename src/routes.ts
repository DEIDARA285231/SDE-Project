import express from 'express';
import {
  gameIGDB,
  genresIGDB,
  coverIGDB,
  artworkIGDB,
  externalGameIGDB,
  topRatedIGDB,
  gameVideosIGDB,
  platformsIGDB,
  gameSpeedrun
} from './controller';

const router = express.Router();

// Possible methods: .get, .post, .put, .patch, .delete

// To add URL parameters (Doable for any method! Not only for GET):
// router.get('/:parameter1/:parameter2', f);

//IGDB
router.get("/games", gameIGDB);                       //OK
router.get("/game/genres", genresIGDB);               //OK
router.get("/game/artworks", artworkIGDB);            //OK
router.get("/game/covers", coverIGDB);                //OK
router.get("/game/externalGame", externalGameIGDB);   //OK
router.get("/games/topRated", topRatedIGDB);          //OK
router.get("/game/gameVideos", gameVideosIGDB);       //OK
router.get("/game/platforms", platformsIGDB);         //OK

//speedrun
router.get('/speedrun', gameSpeedrun);          //search game(s) by param id or name

export default router;
