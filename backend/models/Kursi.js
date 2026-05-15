'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kursi extends Model {
    static associate(models) {
      Kursi.belongsTo(models.Barber,  { foreignKey: 'barber_id', as: 'barber' });
      Kursi.hasMany(models.Booking,   { foreignKey: 'kursi_id', as: 'bookings' });
    }
  }

  Kursi.init({
    id:          { type: DataTypes.STRING(36), primaryKey: true },
    nomor_kursi: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    status:      { type: DataTypes.ENUM('kosong', 'terisi', 'maintenance'), defaultValue: 'kosong' },
    barber_id:   { type: DataTypes.STRING(36) }
  }, {
    sequelize,
    modelName: 'Kursi',
    tableName: 'kursi',
    timestamps: false
  });

  return Kursi;
};
