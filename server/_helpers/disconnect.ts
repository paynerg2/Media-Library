import mongoose from 'mongoose';

export const disconnect = async () => {
    try {
        await mongoose.disconnect();
    } catch (err) {
        console.log(`Error disconnecting from database: ${err}`);
        return process.exit(1);
    }
};
