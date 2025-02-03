const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
      console.error('❌ Database connection error:', err.message);
      process.exit(1);
    });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB Disconnected');
  });

  mongoose.connection.on('error', err => {
    console.error('❌ Mongoose Connection Error:', err);
  });
};

module.exports = connectDB;
