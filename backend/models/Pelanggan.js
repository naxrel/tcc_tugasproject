'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pelanggan extends Model {
    static associate(models) {
      Pelanggan.hasMany(models.Booking, { foreignKey: 'pelanggan_id', as: 'bookings' });
    }
  }

  Pelanggan.init({
    id:       { type: DataTypes.STRING(36), primaryKey: true },
    nama:     { type: DataTypes.STRING(100), allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email:    { type: DataTypes.STRING(100) },
    password: { type: DataTypes.STRING(255), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Pelanggan',
    tableName: 'pelanggan',
    timestamps: false
  });

  return Pelanggan;
};
