import express from 'express';
import {
  plainITAD,
  getStoreLow
} from './controller';

const router = express.Router();

router.get('/getPlain', plainITAD);       //STEAM ID
router.get('/getStoreLow', getStoreLow);  //STEAM ID

export default router;
