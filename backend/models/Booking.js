'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Pelanggan, { foreignKey: 'pelanggan_id', as: 'pelanggan' });
      Booking.belongsTo(models.Barber,    { foreignKey: 'barber_id',    as: 'barber' });
      Booking.belongsTo(models.Kursi,     { foreignKey: 'kursi_id',     as: 'kursi' });
      Booking.belongsTo(models.Layanan,   { foreignKey: 'layanan_id',   as: 'layanan' });
      Booking.hasOne(models.Pembayaran,   { foreignKey: 'booking_id',   as: 'pembayaran' });
    }
  }

  Booking.init({
    id:               { type: DataTypes.STRING(36), primaryKey: true },
    pelanggan_id:     { type: DataTypes.STRING(36), allowNull: false },
    barber_id:        { type: DataTypes.STRING(36), allowNull: false },
    kursi_id:         { type: DataTypes.STRING(36), allowNull: false },
    layanan_id:       { type: DataTypes.STRING(36), allowNull: false },
    status:           { type: DataTypes.ENUM('menunggu', 'proses', 'selesai', 'batal'), defaultValue: 'menunggu' },
    estimasi_selesai: { type: DataTypes.DATE },
    created_at:       { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'booking',
    timestamps: false
  });

  return Booking;
};
