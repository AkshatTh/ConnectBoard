const mongoose = require('mongoose');

// This is the "Contract" for our data
const StrokeSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true 
  },
  options: {
    strokeColor: String,
    lineWidth: Number
  },
  points: [
    { 
      x: Number, 
      y: Number 
    }
  ]
}, { timestamps: true }); // This automatically adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model('Stroke', StrokeSchema);