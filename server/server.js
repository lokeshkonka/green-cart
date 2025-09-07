import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './Routes/userRoute.js';
import sellerRouter from './Routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import ProductRouter from './Routes/ProductRoute.js';
import cartRouter from './Routes/CartRoute.js';
import addressRouter from './Routes/AddressRoute.js';
import orderRouter from './Routes/OrderRoute.js';
import { stripeWebHook } from './Controllers/OrderController.js';

const app = express();
const port = process.env.PORT || 3000;

// ✅ Correct localhost origin
const allowedOrigins = ["http://localhost:5173","https://green-cart-rouge.vercel.app/"];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

await connectDB();
await connectCloudinary();
app.post('/stripe',express.raw({type:'application/json'}),stripeWebHook)

app.get('/', (req, res) => res.send("API IS WORKING"));

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', ProductRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => console.log(`🚀 SERVER IS RUNNING ON ${port}`));
