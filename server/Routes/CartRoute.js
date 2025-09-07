import express from "express";
import authUser from "../Middleware/AuthUser.js";
import { updateCart } from "../Controllers/CartController.js";

const cartRouter= express.Router();
cartRouter.post('/update',authUser,updateCart)

export default cartRouter