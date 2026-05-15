'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('kursi', null, {});
    // Tambah 4 kursi default
    await queryInterface.bulkInsert('kursi', [
      { id: uuidv4(), nomor_kursi: 1, status: 'kosong', barber_id: null },
      { id: uuidv4(), nomor_kursi: 2, status: 'kosong', barber_id: null },
      { id: uuidv4(), nomor_kursi: 3, status: 'kosong', barber_id: null },
      { id: uuidv4(), nomor_kursi: 4, status: 'kosong', barber_id: null },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('kursi', null, {});
  }
};
