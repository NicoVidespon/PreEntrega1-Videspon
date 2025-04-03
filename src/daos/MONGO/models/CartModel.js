import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
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

export const CartModel = mongoose.model("Cart", CartSchema);
