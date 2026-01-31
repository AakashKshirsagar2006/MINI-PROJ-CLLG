const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
    trim: true
  },
  img: {
    type: String,
    required: [true, 'Image path is required']
  },
  highlights: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  tag: {
    type: String,
    default:"Recomended"
  },
  veg_nonveg: {
    type: String,
    required: [true, 'Food category is required'],
    enum: ['Veg', 'Non-Veg']
  },
  type: {
    type: String,
    enum: ['Fast Food', 'Full Meals','Indian Thali', 'Chinese','Italian', 'South Indian', 'Deserts', 'Healthy'],
    default: null
  },
  availability: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    required:true,
    min: [0, 'Price cannot be negative']
  },

  locked_quantity: {
    type: Number,
    required: true,
    min: [0, 'Cannot be negative']
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('FoodItems', foodItemSchema);