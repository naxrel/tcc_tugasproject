'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    static associate(models) {
      Pembayaran.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
    }
  }

  Pembayaran.init({
    id:         { type: DataTypes.STRING(36), primaryKey: true },
    booking_id: { type: DataTypes.STRING(36), allowNull: false, unique: true },
    metode:     { type: DataTypes.ENUM('cash', 'qris', 'transfer'), defaultValue: 'cash' },
    status:     { type: DataTypes.ENUM('pending', 'lunas', 'gagal'), defaultValue: 'pending' },
    jumlah:     { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    dibayar_at: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'Pembayaran',
    tableName: 'pembayaran',
    timestamps: false
  });

  return Pembayaran;
};
