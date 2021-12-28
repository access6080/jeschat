import Room from '../models/Room.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

export const createRoomController = async (req, res) => {
    const { members } = req.body;

    if (!members) return res.status(400).json({ message: "Please Provide Members for a Room" });

    try {
        const room = await Room.create({ members });

        members.forEach((member) => {
            const user = await User.findById(member);

            user.rooms.push(room._id);
        })

        res.status(200).json({ success: true, message: 'Room created successfully', data: room._id });
        
    } catch (error) {
        console.log(error.message);
    }
};

export const sendMessageController = async (req, res) => {
    const { text, room, sender, recipient } = req.body;

    if (!text || !room || !sender || !recipient) return res.status(400).json({ message: "Please Provide A Sender, A Recipient, A Room and A Text Message" });

    try {
        // Create a Message
        const message = await Message.create({
            sender,
            recipient,
            text,
            room
        });

        // Add Message to Room message array
        const messageRoom = await Room.findById(room);
        if (!messageRoom) return res.status(401).json({ message: "Invalid Room"})
        messageRoom.messages.push(message._id);

        // Add Message to Sender message array
        const messageSender = await User.findById(sender);
        if (!messageSender) return res.status(401).json({ message: "Invalid Sender"})
        messageSender.messages.push(message._id);

        res.status(200).json({ success: true, message:"Message added successfully"})

    } catch (error) {
        console.log(error.message);
    }
}