import Room from '../models/Room.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

export const createRoomController = async (req, res) => {
    const { sender, recipient } = req.body;

    if (!sender || !recipient) return res.status(400).json({ message: "Please Provide Members for a Room" });
    const members = [sender, recipient]
    
    try {
        const room = await Room.create({ members });
        
        const senderDoc = await User.findById(sender);
        senderDoc.rooms.push(room._id);
        senderDoc.save();

        const recipientDoc = await User.findById(recipient);
        recipientDoc.rooms.push(room._id);
        recipientDoc.save();

        res.status(200).json({ success: true, message: 'Chat created successfully', response: room._id });
        
    } catch (error) {
        res.status(500).json({ message: error.message })
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

        messageRoom.save();

        // Add Message to Sender message array
        const messageSender = await User.findById(sender);
        if (!messageSender) return res.status(401).json({ message: "Invalid Sender"})
        messageSender.messages.push(message._id);

        messageSender.save();

        res.status(200).json({ success: true, message:"Message added successfully"})

    } catch (error) {
        console.log(error.message);
    }
}