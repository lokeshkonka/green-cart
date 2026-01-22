import jwt from 'jsonwebtoken'
const authSeller = async (req,res,next) => {
    const {SellerToken} = req.cookies;
    if(!SellerToken) return res.json({success:false,message:'Not Seller Authorised'});
    try {
        const tokenDecode = jwt.verify(SellerToken,process.env.JWT_SECRET);
        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        }else{
            return res.json({success:false,message:"Not Authorised Seller"})
        }
    } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
  
    }
}
export default authSeller