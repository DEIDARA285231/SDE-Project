import express from 'express';
import {
  gameTwitch,
  topGamesTwitch,
  searchTwitch,
  streamsTwitch,
  videosTwitch
} from './controller';

const router = express.Router();

router.get('/', gameTwitch);             //ID OK, RICERCA PER NOME
router.get('/topGames', topGamesTwitch); //
router.get('/search/', searchTwitch);    //PARAMETRO QUERY (string), NON TI INTERESSA
router.get('/streams/', streamsTwitch);  //IN GENERALE (top overall), O RICERCA PER (game)ID
router.get('/videos/', videosTwitch);    //IN GENERALE (top overall), O RICERCA PER (game)ID

export default router;
