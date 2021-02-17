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
  gameSpeedrun
} from './controller';

const router = express.Router();

// Possible methods: .get, .post, .put, .patch, .delete

// To add URL parameters (Doable for any method! Not only for GET):
// router.get('/:parameter1/:parameter2', f);

//IGDB
router.get("/games", gameIGDB);                       //ID -> limit 1, NAME -> limit 20
router.get("/game/genres", genresIGDB);               //ID del genere -> return ID nome e url
router.get("/game/artworks", artworkIGDB);            //OK
router.get("/game/covers", coverIGDB);                //OK
router.get("/game/externalGame", externalGameIGDB);   //ID o NAME -> lista external games
router.get("/games/topRated", topRatedIGDB);          //OK
router.get("/game/gameVideos", gameVideosIGDB);       //ID -> url dei video
router.get("/game/releaseDates", releaseIGDB);        //rimuovere
router.get("/game/platforms", platformsIGDB);         //ID piattaforma -> nome della piattaforma

//speedrun
router.get('/speedrun', gameSpeedrun);          //search game(s) by param id or name

export default router;
