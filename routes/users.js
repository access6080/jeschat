import { Router } from 'express';
import { loginController, signupController } from '../controllers/users.js';  

const router = Router();

//Sign Up
router.post('/signup', signupController);
router.post('/login', loginController);

export default router;