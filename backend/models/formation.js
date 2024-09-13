import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  description: String,
  place: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  trainer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
    name: String // If you store the name directly
  },
  image: {
    url: String, // URL to the image
    altText: String // Alternative text for the image
  }
});

const Training = mongoose.model('Training', trainingSchema);

export default Training;

