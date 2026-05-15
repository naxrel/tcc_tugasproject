const { v4: uuidv4 } = require('uuid');
const { Layanan } = require('../../models');

exports.create = async (req, res, next) => {
  try {
    const { nama, durasi_menit, harga } = req.body;
    if (!nama || !durasi_menit || !harga)
      return res.status(400).json({ status: 'fail', message: 'nama, durasi_menit, harga wajib diisi' });
    const layanan = await Layanan.create({ id: uuidv4(), nama, durasi_menit, harga });
    res.status(201).json({ status: 'success', data: layanan });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const data = await Layanan.findAll();
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const layanan = await Layanan.findByPk(req.params.id);
    if (!layanan) return res.status(404).json({ status: 'fail', message: 'Layanan tidak ditemukan' });
    res.status(200).json({ status: 'success', data: layanan });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, durasi_menit, harga } = req.body;
    
    const layanan = await Layanan.findByPk(id);
    if (!layanan) return res.status(404).json({ status: 'fail', message: 'Layanan tidak ditemukan' });

    await layanan.update({
      nama: nama || layanan.nama,
      durasi_menit: durasi_menit || layanan.durasi_menit,
      harga: harga || layanan.harga
    });

    res.status(200).json({ status: 'success', message: 'Layanan berhasil diupdate', data: layanan });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const layanan = await Layanan.findByPk(id);
    if (!layanan) return res.status(404).json({ status: 'fail', message: 'Layanan tidak ditemukan' });

    await layanan.destroy();
    res.status(200).json({ status: 'success', message: 'Layanan berhasil dihapus' });
  } catch (err) {
    next(err);
  }
};
