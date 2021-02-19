import express from 'express';
import {
  plainITAD,
  getStoreLow
} from './controller';

const router = express.Router();

router.get('/getPlain', plainITAD);       //ID DI IGDB -> OK
router.get('/getStoreLow', getStoreLow);  //ID DI IGDB -> OK

export default router;
