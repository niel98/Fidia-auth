const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });

        console.log('MongoDB connected...'.yellow.underline);
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = connectDB;