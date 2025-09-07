
import jwt from 'jsonwebtoken'
//login Seller: /api/seller/login
export const SellerLogin = async (req,res) => {
    try {
        const {email,password} = req.body;
        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
            const token = jwt.sign({email:email},process.env.JWT_SECRET,{expiresIn:'7d'});
            res.cookie('SellerToken',token,{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',maxAge:7 * 24 * 60 * 1000});
            return res.json({success:true,message:"LOGGED IN SELLER"})
        }else{
                   return res.json({success:false,message:"Invalid SELLER"})
     
        }
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
        
    }
}
// api/seller/is-auth
export const IsSellerAuth = async (req, res) => {
  try {
    // user info comes from authUser middleware
    return res.json({ success: true});
  } catch (error) {
    console.error("Error in IsSellerAuth:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// api/seller/logout
export const SellerLogout = async (req,res) => {
    try {
        res.clearCookie('SellerToken',{
            
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === "production" ? 'none' : 'strict',
        
        })
        return res.json({success:true,message:"Seller Logged OUTT"})
    } catch (error) {
         console.log("Error in the Is IN LOGGOUT Seller")
         res.json({success : false ,message:error.message})
    }
}