const mongoose = require('mongoose');

// Schema MongoDB untuk antrean_realtime
const antreanSchema = new mongoose.Schema({
  _id: String, // booking_id
  pelanggan_id: String,
  pelanggan_nama: String,
  kursi_id: String,
  barber_nama: String,
  posisi_antrean: Number,
  estimasi_menit: Number,
  status: { type: String, enum: ['menunggu', 'proses', 'selesai'], default: 'menunggu' },
  updated_at: { type: Date, default: Date.now }
});

const Antrean = mongoose.models.antrean_realtime || mongoose.model('antrean_realtime', antreanSchema);

exports.list = async (req, res, next) => {
  try {
    const data = await Antrean.find({ status: { $ne: 'selesai' } }).sort('posisi_antrean');
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getEstimasi = async (req, res, next) => {
  try {
    const { booking_id } = req.params;
    const antrean = await Antrean.findById(booking_id);
    if (!antrean)
      return res.status(404).json({ status: 'fail', message: 'Booking tidak ditemukan di antrean' });

    res.status(200).json({ status: 'success', data: antrean });
  } catch (err) {
    next(err);
  }
};
