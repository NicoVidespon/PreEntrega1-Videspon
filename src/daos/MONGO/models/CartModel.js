import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productos: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
      }
    ],
    monto: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
