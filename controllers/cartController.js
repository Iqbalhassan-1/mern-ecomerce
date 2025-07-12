import userModel from "../models/userModel.js";

// add product to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1; // increment quantity
            } else {
                cartData[itemId][size] = 1; // add new size with quantity 1
            }
        } else {
            cartData[itemId] = { [size]: 1 }; // add new item with size and quantity 1
        }
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Item added to cart successfully", cartData });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        cartData[itemId][size] = quantity;
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart updated successfully", cartData });

    } catch (error) {
        console.error("Error updating cart:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}

const getUserCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        const cartData =await userData.cartData;
        res.json({ success: true, message: "Cart fetched successfully", cartData });
    } catch (error) {
        console.error("Error fetching user cart:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}


export { addToCart, updateCart, getUserCart };