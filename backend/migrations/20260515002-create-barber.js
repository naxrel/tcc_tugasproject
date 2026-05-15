'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('barber', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      foto_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('aktif', 'nonaktif'),
        defaultValue: 'aktif'
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('barber');
  }
};
