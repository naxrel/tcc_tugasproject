'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kursi', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      nomor_kursi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.ENUM('kosong', 'terisi', 'maintenance'),
        defaultValue: 'kosong'
      },
      barber_id: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: 'barber',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kursi');
  }
};
