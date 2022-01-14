import { Router } from 'express';
import {
    loginController,
    signupController,
    getUserController,
    refreshTokenController,
    avatarController,
    logoutController,
    searchController
} from '../controllers/users.js';  

const router = Router();

//Sign Up
router.get('/user/:name', getUserController)
router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/logout', logoutController);
router.get('/refresh-token', refreshTokenController);
router.post('/search', searchController)
router.patch('/avatar', avatarController);

export default router;