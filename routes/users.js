import { Router } from 'express';
import { loginController, signupController, getUserController } from '../controllers/users.js';  

const router = Router();

//Sign Up
router.get('/', getUserController)
router.post('/signup', signupController);
router.post('/login', loginController);

export default router;