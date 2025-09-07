//add Address /api/address/add

import Address from "../Models/Address.js";

export const addAddress = async (req,res) => {
    try {
        const {address,userId} = req.body;
        await Address.create({...address,userId})
        res.json({success:true,message:"Address added Succesfully"})
    } catch (error) {
        console.log("error in teh add address");
        res.json({success:false,message:error.message})
    }
}
// Get Address: /api/address/get

// GET /api/address/get?userId=123
export const getAddress = async (req,res) => {
    try {
        const { userId } = req.query; // must use query, not body or res
        if(!userId) return res.status(400).json({ success:false, message:"userId required" });

        const addresses = await Address.find({ userId });
        res.json({ success:true, addresses });
    } catch (error) {
        console.error("Error in getAddress:", error);
        res.status(500).json({ success:false, message:error.message });
    }
}
