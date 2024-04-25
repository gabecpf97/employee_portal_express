import express from 'express';
const router = express.Router();
import {RegisterPageController, createHousing} from '../controllers/RegistrationController.js';
import {createUserValidation} from '../middlewares/RegistrationMiddleware.js';

router.post('/auth/signup', createUserValidation, RegisterPageController)
router.post('/housing', createHousing)

export default router;