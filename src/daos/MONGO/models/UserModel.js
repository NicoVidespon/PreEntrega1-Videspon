import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    role: { type: String, default: "user", enum: ["user", "admin"] }
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
