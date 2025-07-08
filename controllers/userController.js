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
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Generate token
            const token = createToken(user._id);
            res.json({ success: true, message: "User logged in successfully", token });
        }
        else {
            return res.json({ success: false, message: "Invalid credentials" });

        }


    } catch (error) {
        console.error("Error logging in user:", error);
        res.json({ success: false, message: error.message || "Internal server error" });

    }

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
        res.json({ success: true, message: "User registered successfully", token });
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