import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        const connectionInst = await mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`);
        console.log('🟢 DB connected succesfully!!! DB_Host:',connectionInst.connection.host)
    }
    catch(error){
        console.error("🛑 Error in connecting DB :",error);
        process.exit(1);
    }
}

export default connectDB;