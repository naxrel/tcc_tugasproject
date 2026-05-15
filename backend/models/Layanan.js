'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Layanan extends Model {
    static associate(models) {
      Layanan.hasMany(models.Booking, { foreignKey: 'layanan_id', as: 'bookings' });
    }
  }

  Layanan.init({
    id:           { type: DataTypes.STRING(36), primaryKey: true },
    nama:         { type: DataTypes.STRING(100), allowNull: false },
    durasi_menit: { type: DataTypes.INTEGER, allowNull: false },
    harga:        { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  }, {
    sequelize,
    modelName: 'Layanan',
    tableName: 'layanan',
    timestamps: false
  });

  return Layanan;
};
