'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('layanan', null, {});
    await queryInterface.bulkDelete('barber', null, {});

    const barberId1 = uuidv4();
    const barberId2 = uuidv4();
    
    await queryInterface.bulkInsert('barber', [
      { id: barberId1, nama: 'Roni Susanto', foto_url: '', status: 'aktif', rating: 4.8 },
      { id: barberId2, nama: 'Bima Arya', foto_url: '', status: 'aktif', rating: 4.5 }
    ]);

    await queryInterface.bulkInsert('layanan', [
      { id: uuidv4(), nama: 'Cukur + Cuci + Pijat', durasi_menit: 30, harga: 35000 },
      { id: uuidv4(), nama: 'Cukur Rambut ', durasi_menit: 20, harga: 25000 },
      { id: uuidv4(), nama: 'Semir Pirang', durasi_menit: 60, harga: 120000 }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('layanan', null, {});
    await queryInterface.bulkDelete('barber', null, {});
  }
};
