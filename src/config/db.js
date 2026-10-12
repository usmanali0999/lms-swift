const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    try {
        // Try connecting with short timeout so app doesn't hang
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // 5 second max wait
            family: 4
        });
        
        isConnected = true;
        console.log(`=======================================================`);
        console.log(`🍃 MongoDB Connected Successfully`);
        console.log(`=======================================================`);
    } catch (error) {
        isConnected = false;
        console.log(`=======================================================`);
        console.log(`⚠️  MongoDB not available → Running in DEMO MODE`);
        console.log(`   (Register/Login will work with temporary memory)`);
        console.log(`=======================================================`);
    }
};

const getDBStatus = () => isConnected;

module.exports = connectDB;
module.exports.getDBStatus = getDBStatus;