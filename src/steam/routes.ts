import express from 'express';
import {
  priceSteam,
  activePlayersSteam
} from './controller';

const router = express.Router();

router.get('/price', priceSteam);                   //SOLO ID DI IGDB -> OK
router.get('/activePlayers', activePlayersSteam);   //SOLO ID DI IGDB -> OK

export default router;
