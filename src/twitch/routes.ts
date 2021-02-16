import express from 'express';
import {
  gameTwitch,
  topGamesTwitch,
  searchTwitch,
  streamsTwitch,
  videosTwitch
} from './controller';

const router = express.Router();

router.get('/', gameTwitch);              //search game by param id or name
router.get('/topGames', topGamesTwitch); //default only 20 results
router.get('/search/', searchTwitch);    //search categories by param query
router.get('/streams/', streamsTwitch);  //search streams, either top overall or by (game)id param
router.get('/videos/', videosTwitch);    //search videos, either top overall or by (game)id param

export default router;
