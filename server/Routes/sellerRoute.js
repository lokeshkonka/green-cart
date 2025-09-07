import express from 'express'
import { SellerLogin,IsSellerAuth,SellerLogout } from './../Controllers/SellerController.js';
import authSeller from './../Middleware/AuthSeller.js';
const sellerRouter = express.Router();

sellerRouter.post('/login',SellerLogin);
sellerRouter.get('/is-auth',authSeller,IsSellerAuth);
sellerRouter.get('/logout',SellerLogout);
export default sellerRouter