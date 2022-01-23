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
        const senderCreated = await Room.findOne({ members });
        if (senderCreated !== null) {
            const recipientData = await User.findById(senderCreated.members[1]) 
            return res.status(200).json({
                success: 201,
                message: 'Room already exists',
                response: { id: recipientData._id, username: recipientData.username }
            })
        }       
        
        const recipientCreated = await Room.findOne({ members: checkMembers });
        if (recipientCreated !== null) {
            const recipientData = await User.findById(recipientCreated.members[0])
            return res.status(200).json({
                success: 202,
                message: 'Room already exists',
                response: { id: recipientData._id, username: recipientData.username }
            })
        }
        

        const room = await Room.create({ members });
        
        const senderDoc = req.user;
        const recipientDoc = await User.findById(recipient);

        senderDoc.rooms.push(room._id);
        senderDoc.friends.push(recipientDoc._id)
        senderDoc.friendCount++
        senderDoc.save();
        
        recipientDoc.rooms.push(room._id);
        recipientDoc.friends.push(senderDoc._id)
        recipientDoc.friendCount++
        recipientDoc.save();

        res.status(200).json({
            success: true, message: 'Chat created successfully', response: {
                room: room._id, username: recipientDoc.username
            }
        });

      
        
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error.message);
    }
};

export const sendMessageController = async (req, res) => {
    const sender = req.user;
    const { text, room, recipient } = req.body;

    if (!text || !room  || !recipient) return res.status(400).json({ message: "Please Provide A Sender, A Recipient, A Room and A Text Message" });

    try {
        const messageRecipient = await User.findOne({ username: recipient });
        if (!messageRecipient) return res.status(401).json({ message: "Invalid recipient" });

        // Create a Message
        const message = await Message.create({
            sender: sender._id,
            recipient: messageRecipient._id,
            text,
            room
        });

        // Add Message to Room message array
        const messageRoom = await Room.findOne({ room });
        // console.log(messageRoom)
        if (!messageRoom) return res.status(401).json({ message: "Invalid Room"})
        messageRoom.messages.push(message._id);

        messageRoom.save();

        // Add Message to Sender message array
        sender.messages.push(message._id);
        sender.save();

        // Add Message to recipient array
        messageRecipient.receivedMessages.push(message._id)

        messageRecipient.save();

        res.status(200).json({ success: true, message:"Message added successfully"})

    } catch (error) {
        console.log(error.message);
    }
}

export const previousRoomsController = async (req, res) => {
    const user = req.user;
 
    try {
        const friends = user.friends;

        if (friends.length === 0) {
            return res.status(200).json({ success: 2, message: "You have no previous conversation(s)." });
        }
        
        
        const prevCon = friends.map(async (friend) => {
            const prevUser = await User.findById(friend);
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

export const getMessages = async (req, res) => {
    const user = req.user
    const { room } = req.body;
    
    try {
        const roomData = await Room.findById(room);
    
        const _r = roomData.messages.map(async (id) => await Message.findById(id).sort({ "createdAt": -1 }));

        const roomMessages = await Promise.all(_r);

        const _result = roomMessages.map( async (message) => {
            const sender = await User.findById(message.sender);

            return {
                sender: sender?.username,
                text: message.text,
                isOpen: message.isOpen,
                timestamp: message.createdAt
            }
        })

        const messageData = await Promise.all(_result);

        res.status(200).json({success: true,  response: messageData});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}