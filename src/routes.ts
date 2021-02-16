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
router.get("/games", gameIGDB);   //param name OR id
router.get("/game/genres", genresIGDB);
router.get("/game/artworks", artworkIGDB);
router.get("/game/covers", coverIGDB);
router.get("/game/externalGame", externalGameIGDB);
router.get("/games/topRated", topRatedIGDB);
router.get("/game/gameVideos", gameVideosIGDB);
router.get("/game/releaseDates", releaseIGDB);
router.get("/game/platforms", platformsIGDB);

//speedrun
router.get('/speedrun', gameSpeedrun);          //search game(s) by param id or name

export default router;
