import express from 'express';
import {
  plainITAD,
  getStoreLow
} from './controller';

const router = express.Router();

router.get('/getPlain', plainITAD);
router.get('/getStoreLow', getStoreLow);

export default router;
