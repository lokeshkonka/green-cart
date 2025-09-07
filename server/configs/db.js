import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected",()=>console.log("Database Connected Succesfully")
        );
    await mongoose.connect(`${process.env.MONGODB_URI}/greencart`)
    } catch (error) {
        console.error(error.message);
        console.log("Mongodb Connection Error");
        
        
    }

}
export default connectDB