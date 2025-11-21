import mongoose from "mongoose";
const connDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI , {
            serverSelectionTimeoutMS: 5000,
            
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}
export default connDB
