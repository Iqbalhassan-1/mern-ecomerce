import express from "express";
import { allOrders, placeOrder, placeOrderRazorpay, placingOrderStripe, UpdateOrderStatus, userOrders, verifyStripe } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";


const orderRouter = express.Router();
// admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.get("/status", adminAuth, UpdateOrderStatus)
//payment routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placingOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// user routes
orderRouter.post("/userorders", authUser, userOrders);
// verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);

export default orderRouter;