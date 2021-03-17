import express from 'express';
import { findAndUpdate, findByIDorName } from './controller';

const router = express.Router();


router.get('/find', findByIDorName);      

router.post('/update', findAndUpdate);  

export default router;
