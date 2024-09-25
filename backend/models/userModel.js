// userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'participant', 'formateur'],
    default: 'participant',
  },
  name: {
    type: String,
  },
  assignedFormations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Training' }],

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Training' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
