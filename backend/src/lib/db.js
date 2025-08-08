import mongoose from 'mongoose'

export const connectDB = async()=>{
    try {
        const db= await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connection successful');
        
    } catch (error) {
        console.log('DB connection failed :', error);
        throw(error)
        
    }
}