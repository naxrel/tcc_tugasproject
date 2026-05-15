// const { Pelanggan } = require('../../models'); // aktifkan setelah migrasi

exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const pelanggan = await Pelanggan.findByPk(id, { attributes: { exclude: ['password'] } });
    // if (!pelanggan) return res.status(404).json({ status: 'fail', message: 'Pelanggan tidak ditemukan' });

    res.status(200).json({ status: 'success', data: { id } }); // TODO: ganti dengan data nyata
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, email } = req.body;

    // TODO: update di DB
    // await Pelanggan.update({ nama, email }, { where: { id } });

    res.status(200).json({ status: 'success', message: 'Profil diperbarui' });
  } catch (err) {
    next(err);
  }
};
