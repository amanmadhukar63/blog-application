import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log('🟢 DB connected succesfully!!!');
    }
    catch(error){
        console.error("🛑 Error in connecting DB :",error);
        process.exit(1);
    }
}

export default connectDB;