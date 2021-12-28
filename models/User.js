import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    require: true,
    minlength: 6,
    select: false,
  },

  messages: {
    type: [mongoose.ObjectId]
  },
    
  rooms: {
    type: [mongoose.ObjectId]
  }

});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const User = mongoose.model('User', UserSchema);

export default User;