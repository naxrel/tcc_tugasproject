// const { Pembayaran, Booking, Layanan } = require('../../models');

exports.create = async (req, res, next) => {
  try {
    const { booking_id, metode, jumlah } = req.body;
    // TODO: validasi Zod
    // TODO: cek booking ada & statusnya 'proses' atau 'selesai'
    // TODO: simpan pembayaran
    // TODO: update status booking menjadi 'selesai'
    res.status(201).json({ status: 'success', message: 'Pembayaran berhasil' });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const pembayaran = await Pembayaran.findByPk(id, { include: ['Booking'] });
    res.status(200).json({ status: 'success', data: { id } });
  } catch (err) {
    next(err);
  }
};
