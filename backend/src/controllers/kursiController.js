const { Kursi, Barber } = require('../../models');
const mongoose = require('mongoose');

// Mongoose schema untuk status_kursi di MongoDB
const statusKursiSchema = new mongoose.Schema({
  _id: String,
  nomor_kursi: Number,
  status: { type: String, enum: ['kosong', 'terisi', 'maintenance'], default: 'kosong' },
  barber_id: String,
  barber_nama: String,
  booking_aktif_id: String,
  mulai_at: Date,
  estimasi_selesai: Date,
  updated_at: { type: Date, default: Date.now }
});

const StatusKursi = mongoose.models.status_kursi || mongoose.model('status_kursi', statusKursiSchema);

exports.list = async (req, res, next) => {
  try {
    const data = await Kursi.findAll({
      include: [{ model: Barber, as: 'barber', attributes: ['id', 'nama', 'rating'] }],
      order: [['nomor_kursi', 'ASC']]
    });
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ['kosong', 'terisi', 'maintenance'];
    if (!validStatus.includes(status))
      return res.status(400).json({ status: 'fail', message: `Status harus salah satu dari: ${validStatus.join(', ')}` });

    const kursi = await Kursi.findByPk(id);
    if (!kursi) return res.status(404).json({ status: 'fail', message: 'Kursi tidak ditemukan' });

    await kursi.update({ status });

    // Sync ke MongoDB status_kursi
    try {
      await StatusKursi.findByIdAndUpdate(
        id,
        { status, updated_at: new Date() },
        { upsert: true, new: true }
      );
    } catch (mongoErr) {
      console.warn('MongoDB sync gagal (non-fatal):', mongoErr.message);
    }

    res.status(200).json({ status: 'success', message: `Kursi ${kursi.nomor_kursi} diperbarui menjadi "${status}"`, data: kursi });
  } catch (err) {
    next(err);
  }
};
