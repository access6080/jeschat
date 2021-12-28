import { Router } from 'express';
import {createRoomController,  sendMessageController} from '../controllers/messages.js'

const router = Router();

router.post('/create-room', createRoomController);
router.post('/send-message', sendMessageController);

export default router;