import express from 'express';
import {
  priceSteam,
  activePlayersSteam
} from './controller';

const router = express.Router();

router.get('/price', priceSteam);
router.get('/activePlayers', activePlayersSteam);

export default router;
