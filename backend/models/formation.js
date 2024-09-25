// import mongoose from 'mongoose';

// const trainingSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   trainingLevel: { type: String, required: true },
//   trainingCategory: { type: String, required: true },
//   place: { type: String, required: true },
//   image: {
//     url: { type: String, required: true },
//     altText: { type: String } 
//   },
//   wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true }],
//   trainingLevel: { 
//     type: String, 
//     enum: ['Beginner', 'Intermediate', 'Advanced'], 
//     required: true 
//   },
//   trainingCategory: { 
//     type: String, 
//     required: true 
//   },
//   curriculum: [{
//     title: { type: String, required: true },
//     content: { type: String, required: true }
//   }],
//   requirements: [{ type: String , required: true }]
// }, { timestamps: true });


// const Training = mongoose.model('Training', trainingSchema);

// export default Training;

// models/trainingModel.js



// models/trainingModel.js
import mongoose from 'mongoose';
const trainingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return this.endDate ? value < this.endDate : true;
      },
      message: 'Start date must be before end date'
    }
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return this.startDate ? value > this.startDate : true;
      },
      message: 'End date must be after start date'
    }
  },
  description: String,
  place: { type: String, required: true },
  trainingLevel: String,
  trainingCategory: { type: String, required: true },
  curriculum: [{ title: String, content: String }], // Updated to handle objects
  requirements: [String],
  image: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Training = mongoose.model('Training', trainingSchema);

export default Training;
