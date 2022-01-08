import { Router } from 'express';
import {
    loginController,
    signupController,
    getUserController,
    refreshTokenController,
    avatarController
} from '../controllers/users.js';  

const router = Router();

//Sign Up
router.post('/user/:username', getUserController)
router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/refresh-token', refreshTokenController);
router.patch('/avatar', avatarController);

export default router;