import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData:{type:Object,default:{}},
},{minimize:false})

// minimize: false allows empty objects to be stored in the database

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;