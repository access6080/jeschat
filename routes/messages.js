import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {createRoomController,  sendMessageController, previousRoomsController} from '../controllers/messages.js'

const router = Router();

router.post('/create-room', protect, createRoomController);
router.post('/send-message', protect, sendMessageController);
router.get('/prev', protect, previousRoomsController)

export default router;