'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pembayaran', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      booking_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        unique: true,
        references: { model: 'booking', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      metode: {
        type: Sequelize.ENUM('cash', 'qris', 'transfer'),
        defaultValue: 'cash'
      },
      status: {
        type: Sequelize.ENUM('pending', 'lunas', 'gagal'),
        defaultValue: 'pending'
      },
      jumlah: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      dibayar_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pembayaran');
  }
};
