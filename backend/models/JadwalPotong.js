'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JadwalPotong extends Model {
    static associate(models) {
      JadwalPotong.belongsTo(models.Barber, { foreignKey: 'barber_id', as: 'barber' });
    }
  }

  JadwalPotong.init({
    id:          { type: DataTypes.STRING(36), primaryKey: true },
    barber_id:   { type: DataTypes.STRING(36), allowNull: false },
    hari:        { type: DataTypes.ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') },
    jam_mulai:   { type: DataTypes.TIME, allowNull: false },
    jam_selesai: { type: DataTypes.TIME, allowNull: false }
  }, {
    sequelize,
    modelName: 'JadwalPotong',
    tableName: 'jadwal_potong',
    timestamps: false
  });

  return JadwalPotong;
};
