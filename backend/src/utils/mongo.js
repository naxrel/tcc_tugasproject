const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB terhubung ✅');
  } catch (err) {
    console.warn('⚠️  MongoDB tidak terhubung — fitur antrean & notifikasi nonaktif.');
    console.warn('   Pastikan MongoDB berjalan jika ingin menggunakan fitur realtime.');
  }
};

connectMongo();

module.exports = mongoose;
