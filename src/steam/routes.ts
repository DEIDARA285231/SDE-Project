import express from 'express';
import {
  priceSteam,
  activePlayersSteam
} from './controller';

const router = express.Router();

router.get('/price', priceSteam);                   //SOLO ID
router.get('/activePlayers', activePlayersSteam);   //SOLO ID

export default router;
