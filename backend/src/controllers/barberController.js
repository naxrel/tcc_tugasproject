const { v4: uuidv4 } = require('uuid');
const { Barber } = require('../../models');

exports.list = async (req, res, next) => {
  try {
    const data = await Barber.findAll({ where: { status: 'aktif' } });
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nama, foto_url } = req.body;
    if (!nama) return res.status(400).json({ status: 'fail', message: 'Nama wajib diisi' });

    const barber = await Barber.create({ id: uuidv4(), nama, foto_url: foto_url || null });
    res.status(201).json({ status: 'success', data: barber });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Barber.update(req.body, { where: { id } });
    res.status(200).json({ status: 'success', message: 'Data barber diperbarui' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Barber.update({ status: 'nonaktif' }, { where: { id } });
    res.status(200).json({ status: 'success', message: 'Barber dinonaktifkan' });
  } catch (err) {
    next(err);
  }
};
