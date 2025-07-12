import express from 'express';

const cartRouter = express.Router();
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js';
import authUser from '../middleware/auth.js';
cartRouter.post('/add',authUser, addToCart);
cartRouter.post('/update',authUser, updateCart); 
cartRouter.get('/get',authUser, getUserCart);

export default cartRouter;