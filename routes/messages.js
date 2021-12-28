import { Router } from 'express';
import {createRoomController,  sendMessageController} from '../controllers/messages.js'

const router = Router();

router.post('/createRoom', createRoomController);
router.post('/sendMessage', sendMessageController);

export default router;