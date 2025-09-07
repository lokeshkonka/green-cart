//Registering the USer : /api/user/register
import User from './../Models/User.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const register = async (req,res) => {

    try {
        const {name,email,password} = req.body;
    if (!name ||!email||!password) {
        return res.json({success:false,message:"Missing Details in registration"})
    }
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.json({success:false,message:"User Already Exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({name,email,password:hashedPassword});
    
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

    res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',maxAge:7 * 24 * 60 * 1000});


    return res.json({success : true ,user:{email:user.email,name:user.name,}})
    }

     catch (error) {
       res.json({success : false ,message:error.message})
    }
}
// LoginUser : /api/user/login
export const LoginUser = async (req,res) => {

    try {
            const {email,password} =req.body;
    if (!email || ! password) {
        return res.json({success:false,message:"Email and Password are required"})
    }
        const user = await User.findOne({email});
        if(!user) return res.json({success: false , message :"invalid Email or Password"});
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
        return res.json({success:false,message:" Password is wrong"})
            
        }
const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',maxAge:7 * 24 * 60 * 1000});


return res.json({success : true ,user:{email:user.email,name:user.name,}})
 
    } catch (error) {
        console.log("Error in teh Login")
         res.json({success : false ,message:error.message})
    }
    }

// Check Auth : api/user/is-auth
export const IsAuth = async (req, res) => {
  try {
    // user info comes from authUser middleware
    const { id } = req.user;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Error in IsAuth:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//logout :api/user/logout
export const Logout = async (req,res) => {
    try {
        res.clearCookie('token',{
            
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === "production" ? 'none' : 'strict',
        
        })
        return res.json({success:true,message:"Logged OUTT"})
    } catch (error) {
         console.log("Error in teh Is IN LOGGOUT")
         res.json({success : false ,message:error.message})
    }
}