import mongoose from 'mongoose';

const RoomSchema = mongoose.Schema({
    members: {
        type: [mongoose.ObjectId],
        required: true,
        unique: true
    },

    messages: {
        type: [mongoose.ObjectId],
        required: false
    }
});

const Room = mongoose.model('Room', RoomSchema);

export default Room;