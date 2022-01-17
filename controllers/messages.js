import Room from '../models/Room.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

export const createRoomController = async (req, res) => {
    const recipient = req.body.data;
    const sender = req.user._id;

    if (!sender || !recipient) return res.status(400).json({ message: "Please Provide Members for a Room" });
    const members = [sender, recipient]
    const checkMembers = [recipient, sender]
    
    try {
        // Check If Room already exists and return id
        const senderCreated = await Room.find({ members });
        if (senderCreated.length) return res.status(200).json({ success: 201, message: 'Room already exists', response: {id: senderCreated[0]._id} })
        
        const recipientCreated = await Room.find({ members: checkMembers });
        if (recipientCreated.length) return res.status(200).json({ success: 202, message: 'Room already exists', response: {id: recipientCreated[0]._id} })
        

        const room = await Room.create({ members });
        
        const senderDoc = req.user;
        const recipientDoc = await User.findById(recipient);

        senderDoc.rooms.push(recipientDoc._id);
        senderDoc.save();

        recipientDoc.rooms.push(senderDoc._id);
        recipientDoc.save();

        res.status(200).json({
            success: true, message: 'Chat created successfully', response: {
                room: room._id, username: recipientDoc._id
            }
        });

      
        
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

export const previousRoomsController = async (req, res) => {
    const user = req.user;
 
    try {
        const rooms = user.rooms;

        if (rooms.length === 0) {
            return res.status(200).json({ success: 2, message: "You have no previous conversation(s)." });
        }
        
        
        const prevCon = rooms.map(async (room) => {
            const prevUser = await User.findById(room);
            return {
                id: prevUser._id,
                username: prevUser.username,
                avatar: prevUser.avatar
            }
        });

        Promise.all(prevCon).then(result => res.status(200).json({ success: true, response: result }));
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}