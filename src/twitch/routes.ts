import express from 'express';
import {
  gameTwitch,
  topGamesTwitch,
  searchTwitch,
  streamsTwitch,
  videosTwitch
} from './controller';

const router = express.Router();

router.get('/', gameTwitch);             //OK
router.get('/topGames', topGamesTwitch); //OK
router.get('/search/', searchTwitch);    //OK
router.get('/streams/', streamsTwitch);  //OK
router.get('/videos/', videosTwitch);    //OK

export default router;
