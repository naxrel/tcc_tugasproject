'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('layanan', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      durasi_menit: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      harga: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('layanan');
  }
};
