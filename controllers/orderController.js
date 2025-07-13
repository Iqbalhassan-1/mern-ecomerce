// placing order cod
import OrderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = 'pak';
const deliveryFee = 500; 
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const newOrder = new OrderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod:"COD",
            payment: false,
            date: Date.now()
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId,{cardData:{}});
        res.json({ success: true, message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}

const placingOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const newOrder = new OrderModel({   
            userId,
            items,
            amount,
            address,
            paymentMethod:"Stripe",
            date: Date.now()
        });
        await newOrder.save();
        const lineItems = items.map(item => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name,
                    description: item.description,
                },
                unit_amount: item.price * 100, // Convert to cents
            },
            quantity: item.quantity,
        }));
        lineItems.push({
            price_data: {
                currency,
                product_data: {
                    name: 'Delivery Fee',
                },
                unit_amount:deliveryFee * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/verify?success=true&orderId={newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId={newOrder._id}`,
        });
        res.json({ success: true, message: "Order placed successfully with Stripe", session_url: session.url });
    } catch (error) {
        console.error("Error placing order with Stripe:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}

const verifyStripe= async (req, res) => {
   try {
    
    const {orderId,success,userId} = req.query;
    if (success === 'true') {
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        order.status = "Completed";
        order.payment = true;
        await order.save();
        res.json({ success: true, message: "Payment successful", order });
    } else {
        await OrderModel.findByIdAndDelete(orderId);
        res.json({ success: false, message: "Payment failed" });
    }
   } catch (error) {
        console.error("Error verifying Stripe payment:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
   }
}

const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;
        const newOrder = new OrderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod,
            date: Date.now()
        });
        await newOrder.save();
        res.json({ success: true, message: "Order placed successfully with Razorpay", order: newOrder });
    } catch (error) {
        console.error("Error placing order with Razorpay:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}
// all orders for admin
const allOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        if (orders.length === 0) {
            return res.json({ success: false, message: "No orders found" });
        }
        res.json({ success: true, message: "Orders fetched successfully", orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}

const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId;
        const orders = await OrderModel.find({ userId });
        if (orders.length === 0) {
            return res.json({ success: false, message: "No orders found for this user" });
        }
        res.json({ success: true, message: "User orders fetched successfully", orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}

const UpdateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, { status });
        if (!updatedOrder) {    
            return res.json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {   
        console.error("Error updating order status:", error);
        res.json({ success: false, message: error.message || "Internal server error" });
    }
}

export { placeOrder, placingOrderStripe, placeOrderRazorpay, allOrders, userOrders, UpdateOrderStatus,verifyStripe };