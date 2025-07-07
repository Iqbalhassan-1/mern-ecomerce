import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
// login user route
// This function will handle user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

}

// register user route
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }
        //hasing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        // Save user to database
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, message: "User registered successfully",token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}

//route for admin login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
}

export { loginUser, registerUser, adminLogin };