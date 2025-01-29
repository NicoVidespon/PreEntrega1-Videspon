import mongoose from "mongoose";

// esquema del carrito
const cartSchema = new mongoose.Schema(
  {
    productos: [
      {
        producto: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product", 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true, 
          min: [1, 'La cantidad no puede ser menor que 1'], 
        },
      },
    ],
    monto: { 
      type: Number, 
      default: 0 
    }
  },
  { timestamps: true }  
);

export const CartModel = mongoose.model("Cart", cartSchema);
