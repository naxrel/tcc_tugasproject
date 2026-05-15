'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      pelanggan_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'pelanggan', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      barber_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'barber', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      kursi_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'kursi', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      layanan_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'layanan', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      status: {
        type: Sequelize.ENUM('menunggu', 'proses', 'selesai', 'batal'),
        defaultValue: 'menunggu'
      },
      estimasi_selesai: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking');
  }
};
