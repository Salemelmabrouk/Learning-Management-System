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
  name: { type: String, required: true,unique :true},
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, default: '' }, // Default to an empty string
  place: { type: String, required: true },
  trainingLevel: { type: String, required: true },
  trainingCategory: { type: String, required: true },
  curriculum: [{
    title: { type: String, required: true },
    content: { type: String, required: true } // Ensure this field is provided
  }],
  requirements: { type: [String], default: [] }, // Default to an empty array
  image: { type: String }, // Ensure this field is provided
    // Add other image-related fields if necessary
 
  participants: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }
});

const Training = mongoose.model('Training', trainingSchema);

export default Training;
