import { Router } from 'express';
import { loginController, signupController, getUserController, refreshTokenController } from '../controllers/users.js';  

const router = Router();

//Sign Up
router.post('/', getUserController)
router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/refresh-token', refreshTokenController);

export default router;