import express from 'express';
import { upload } from './../configs/Multer.js';
import authSeller from './../Middleware/AuthSeller.js';
import { addProduct, changeStock, productById, ProductList } from '../Controllers/productController.js';

const ProductRouter= express.Router();

ProductRouter.post('/add',upload.array(["images"]),authSeller,addProduct)

ProductRouter.get('/list',ProductList)
ProductRouter.get('/id',productById)

ProductRouter.post('/stock',authSeller,changeStock)

export default ProductRouter



