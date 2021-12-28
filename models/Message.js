import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    },

    recipient: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    room: {
        type: mongoose.ObjectId,
        required: true
    }
})

const Message = mongoose.model('Message', MessageSchema);

export default Message;

