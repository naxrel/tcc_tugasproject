const { v4: uuidv4 } = require('uuid');
const { Booking, Pelanggan, Barber, Kursi, Layanan } = require('../../models');
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
  status: { type: String, enum: ['menunggu', 'proses', 'selesai', 'batal'], default: 'menunggu' },
  updated_at: { type: Date, default: Date.now }
}, { strict: false });

const Antrean = mongoose.models.antrean_realtime || mongoose.model('antrean_realtime', antreanSchema);

exports.create = async (req, res, next) => {
  try {
    const { barber_id, kursi_id, layanan_id } = req.body;
    const pelanggan_id = req.user.id;

    if (!barber_id || !kursi_id || !layanan_id) {
      return res.status(400).json({ status: 'fail', message: 'barber_id, kursi_id, layanan_id wajib diisi' });
    }

    // 1. Cek barber & layanan
    const barber = await Barber.findByPk(barber_id);
    const layanan = await Layanan.findByPk(layanan_id);
    const pelanggan = req.user; // req.user sudah berisi decode token (ada id, nama)

    if (!barber || !layanan) {
      return res.status(404).json({ status: 'fail', message: 'Barber atau Layanan tidak ditemukan' });
    }

    // 2. Simpan booking ke MySQL
    const booking_id = uuidv4();
    const estimasi_selesai = new Date(Date.now() + layanan.durasi_menit * 60000);
    const booking = await Booking.create({
      id: booking_id,
      pelanggan_id,
      barber_id,
      kursi_id,
      layanan_id,
      status: 'menunggu',
      estimasi_selesai
    });

    // 3. Update antrean_realtime di MongoDB
    try {
      // Hitung posisi antrean (jumlah antrean yang belum selesai)
      const count = await Antrean.countDocuments({ status: 'menunggu' });
      
      await Antrean.create({
        _id: booking_id,
        pelanggan_id,
        pelanggan_nama: pelanggan.nama || 'Pelanggan',
        kursi_id,
        barber_nama: barber.nama,
        posisi_antrean: count + 1,
        estimasi_menit: layanan.durasi_menit, // Sederhana: pake durasi layanan
        status: 'menunggu'
      });
    } catch (mongoErr) {
      console.warn('MongoDB sync gagal (non-fatal):', mongoErr.message);
    }

    res.status(201).json({ status: 'success', message: 'Booking berhasil dibuat', data: booking });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, { include: ['pelanggan', 'barber', 'kursi', 'layanan'] });
    if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking tidak ditemukan' });
    res.status(200).json({ status: 'success', data: booking });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Pelanggan, as: 'pelanggan', attributes: ['id', 'nama', 'username'] },
        { model: Barber, as: 'barber', attributes: ['id', 'nama'] },
        { model: Kursi, as: 'kursi', attributes: ['id', 'nomor_kursi'] },
        { model: Layanan, as: 'layanan', attributes: ['id', 'nama'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ status: 'success', data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'menunggu' | 'proses' | 'selesai' | 'batal'

    const validStatus = ['menunggu', 'proses', 'selesai', 'batal'];
    if (!validStatus.includes(status))
      return res.status(400).json({ status: 'fail', message: `Status harus salah satu dari: ${validStatus.join(', ')}` });

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking tidak ditemukan' });

    await booking.update({ status });

    // Sync ke MongoDB antrean_realtime
    try {
      await Antrean.findByIdAndUpdate(id, { status, updated_at: new Date() });
    } catch (mongoErr) {
      console.warn('MongoDB sync gagal (non-fatal):', mongoErr.message);
    }

    res.status(200).json({ status: 'success', message: `Status booking diperbarui menjadi ${status}` });
  } catch (err) {
    next(err);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ status: 'fail', message: 'Booking tidak ditemukan' });

    await booking.update({ status: 'batal' });

    try {
      await Antrean.findByIdAndUpdate(id, { status: 'batal', updated_at: new Date() });
    } catch (mongoErr) {
      console.warn('MongoDB sync gagal (non-fatal):', mongoErr.message);
    }

    res.status(200).json({ status: 'success', message: 'Booking dibatalkan' });
  } catch (err) {
    next(err);
  }
};
