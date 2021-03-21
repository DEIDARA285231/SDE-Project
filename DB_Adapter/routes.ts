import express from 'express';
import { findAndUpdate, findByIDorName, findAndUpdateUser, findUser, createUser } from './controller';

const router = express.Router();


router.get('/find', findByIDorName);

router.get('/finduser', findUser);

router.post('/update', findAndUpdate);

router.post('/updateuser', findAndUpdateUser);

router.post('/createuser', createUser);

export default router;
