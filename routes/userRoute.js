import express from 'express';
const router = express.Router();
import {RegisterPageController} from '../controllers/RegistrationController.js';

router.post('/auth/signup', RegisterPageController)

export default router;