
import Product from './../Models/Product.js';
import Order from './../Models/Order.js';
import stripe from 'stripe'
import User from './../Models/User.js';
// COD : api/order/cod

export const placeOrderCOD = async (req,res) => {
    try {
            const {userId,items,address}=req.body;
            if(!address || items.length === 0){
                return res.json({success:false,message:"Invalid Data order"});

            }
            //calculate amount using items,
            let amount = await items.reduce(async (acc,item) => {
                const product = await Product.findById(item.product);
                return( await acc) + product.offerPrice * item.quantity;
            },0)
            //add Tax Charge
            amount+=Math.floor(amount * 0.02);
            await Order.create({userId,items,amount,address,paymentType:"COD",})
   
   res.json({success:true,message:"Order Placed Successfully"});
        } catch (error) {
        console.log("error in order Controller");
        res.json({success:false,message:error.message})
        
    }
}
// COD : api/order/stripe

export const placeOrderStripe = async (req,res) => {
    try {
            const {userId,items,address}=req.body;
            const {origin} = req.headers;

            if(!address || items.length === 0){
                return res.json({success:false,message:"Invalid Data order"});

            }
            let productData = [];

            //calculate amount using items,
            let amount = await items.reduce(async (acc,item) => {
                const product = await Product.findById(item.product);
                productData.push({
                    name:product.name,
                    price:product.offerPrice,
                    quantity:item.quantity,
                })
                return( await acc) + product.offerPrice * item.quantity;
            },0)
            //add Tax Charge
            amount+=Math.floor(amount * 0.02);
            const order = await Order.create({userId,items,amount,address,paymentType:"Online",})
   //stripe Gateway
   const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

   //create line Items for stripe
   const line_items = productData.map((item)=>{return {
    price_data:{
        currency:"inr", //gbp
        product_data:{
            name:item.name
        },
        unit_amount:Math.floor(item.price + item.price * 0.02)*100
    },
    quantity:item.quantity

   }})
// create session
const session = await stripeInstance.checkout.sessions.create({
    line_items,mode:"payment",
    success_url:`${origin}/loader?next=my-orders`,
    cancel_url:`${origin}/cart`,
    metadata:{
        orderId:order._id.toString(),
        userId,
    }
})
   res.json({success:true,url:session.url});
        } catch (error) {
        console.log("error in order Controller");
        res.json({success:false,message:error.message})
        
    }
}

/// Stripe WEebhook

export const stripeWebHook = async (req,res) => {
    //stripe gateway
       const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
       const sig = req.headers["stripe-signature"];
       let event;
       try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            process.env.STRIPE_WEBHOOK_SECRET
        );

       } catch (error) {
        res.status(400).send(`Webhook error ${error.message}`)      
       }

       //handle event
       switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            //getting metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId
            });
            const {orderId , userId} =session.data[0].metadata;
            //mark payment as paid
            await Order.findByIdAndUpdate(orderId,{isPaid:true})
            //clear user cart
            await User.findByIdAndUpdate(userId,{cartItems:{}});
            break;
        }
         case "payment_intent.payment_failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            //getting metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId
            });
            const {orderId} =session.data[0].metadata;
            await Order.findByIdAndDelete(orderId)
            break;
         }
         
       
        default:
            console.error(`Unhandledd event type ${event.type}`)
            break;
       }
       res.json({received:true});
}
/// api/order/user
export const getUserOrders = async (req,res) => {
    try {
        const {userId}= req.query;
        const orders = await Order.find({userId,
            $or : [{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1})
    res.json({success:true,orders});
    
    } catch (error) {
        console.log("error in getuser order");
        res.json({success:false,message:error.message})
    }
}

// Get All Orders for seller /api/order/seller

export const getAllOrders = async (req,res) => {
    try {
    



        const orders = await Order.find({
            $or : [{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1})
    res.json({success:true,orders});
    




    } catch (error) {
        console.log("error in getuser seller order");
        res.json({success:false,message:error.message})
    }
}











