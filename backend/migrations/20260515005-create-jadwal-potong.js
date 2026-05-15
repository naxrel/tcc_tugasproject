'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jadwal_potong', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      barber_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'barber',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      hari: {
        type: Sequelize.ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'),
        allowNull: false
      },
      jam_mulai: {
        type: Sequelize.TIME,
        allowNull: false
      },
      jam_selesai: {
        type: Sequelize.TIME,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jadwal_potong');
  }
};
