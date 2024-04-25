import express from 'express';
const router = express.Router();
import {RegisterPageController} from '../controllers/RegistrationController.js';
import {createUserValidation} from '../middlewares/RegistrationMiddleware.js';

router.post('/auth/signup', createUserValidation, RegisterPageController)

export default router;