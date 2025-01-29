import mongoose from 'mongoose';

// esquema del producto
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
  },
  description: {
    type: String,
    required: true, 
  },
  code: {
    type: String,
    required: true,
    unique: true,  
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo'],
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'El stock no puede ser negativo'],
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
   
  },
  status: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
