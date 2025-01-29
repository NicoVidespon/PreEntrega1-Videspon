import mongoose from "mongoose";

// esquema del usuario
const userSchema = new mongoose.Schema(
  {
    first_name: { 
      type: String, 
      required: true 
    },
    last_name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido']  
    },
    cartId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Cart" 
    }
  },
  { timestamps: true }  
);

export const UserModel = mongoose.model("User", userSchema);
