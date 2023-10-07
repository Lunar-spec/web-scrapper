import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    mongoose.set("strictQuery", true);

    if (!process.env.MONGODB_URL) return console.log("Zeus is sleeping ⚡");

    if (isConnected) return console.log("Zeus is up ⚡");

    try {
        await mongoose.connect(process.env.MONGODB_URL);

        isConnected = true;

        console.log("Hail thunder ⚡");
    } catch (error) {
        console.log(error);
    }
};
