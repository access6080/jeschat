import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

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
  },

  avatar: {
    type: Object,
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

UserSchema.methods.getAccessJwtToken = function () {
  return jwt.sign({ id: this._id, username: this.username }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT__ACCESS_EXPIRE,
  });
};

UserSchema.methods.getRefreshJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT__REFRESH_EXPIRE,
  });
};


const User = mongoose.model('User', UserSchema);

export default User;