'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Barber extends Model {
    static associate(models) {
      Barber.hasMany(models.Kursi,        { foreignKey: 'barber_id', as: 'kursi' });
      Barber.hasMany(models.Booking,      { foreignKey: 'barber_id', as: 'bookings' });
      Barber.hasMany(models.JadwalPotong, { foreignKey: 'barber_id', as: 'jadwal' });
    }
  }

  Barber.init({
    id:       { type: DataTypes.STRING(36), primaryKey: true },
    nama:     { type: DataTypes.STRING(100), allowNull: false },
    foto_url: { type: DataTypes.STRING(255) },
    status:   { type: DataTypes.ENUM('aktif', 'nonaktif'), defaultValue: 'aktif' },
    rating:   { type: DataTypes.FLOAT, defaultValue: 0 }
  }, {
    sequelize,
    modelName: 'Barber',
    tableName: 'barber',
    timestamps: false
  });

  return Barber;
};
