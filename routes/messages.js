import { Router } from 'express';
import {createRoomController,  sendMessageController, previousRoomsController} from '../controllers/messages.js'

const router = Router();

router.post('/create-room', createRoomController);
router.post('/send-message', sendMessageController);
router.post('/prev', previousRoomsController)

export default router;