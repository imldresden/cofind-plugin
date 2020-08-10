const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  __id: Schema.Types.ObjectId,
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
  // isLoggedIn: {
  //   type: Boolean,
  //   default: false
  // }
}, {
    timestamps: true
  });
const User = mongoose.model('User', UserSchema);
module.exports = User;