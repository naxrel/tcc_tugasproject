const mongoose = require('mongoose');

// Schema MongoDB untuk notifikasi
const notifikasiSchema = new mongoose.Schema({
  pelanggan_id: { type: String, required: true },
  booking_id: String,
  pesan: String,
  tipe: { type: String, enum: ['giliran', 'selesai', 'batal'], default: 'giliran' },
  sudah_dibaca: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const Notifikasi = mongoose.model('notifikasi', notifikasiSchema);

exports.list = async (req, res, next) => {
  try {
    const { pelanggan_id } = req.params;
    const data = await Notifikasi.find({ pelanggan_id }).sort({ created_at: -1 });
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notifikasi.findByIdAndUpdate(id, { sudah_dibaca: true });
    res.status(200).json({ status: 'success', message: 'Notifikasi ditandai sudah dibaca' });
  } catch (err) {
    next(err);
  }
};
