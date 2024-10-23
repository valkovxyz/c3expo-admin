// server/db/mongoose.js
import mongoose from 'mongoose';

let cached = false;

export const connectToDatabase = async () => {
    const config = useRuntimeConfig();

    if (cached) {
        return mongoose;
    }

    try {
        await mongoose.connect(config.mongodbUri);
        cached = true;
        console.log('Connected to MongoDB');
        return mongoose;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

export default defineNitroPlugin(async () => {
    try {
        await connectToDatabase();
    } catch (error) {
        console.error('Failed to initialize MongoDB connection:', error);
    }
});