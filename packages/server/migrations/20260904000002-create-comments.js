'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      topicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'topics', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'comments', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      authorLogin: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    await queryInterface.addIndex('comments', ['topicId'])
    await queryInterface.addIndex('comments', ['parentId'])
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comments')
  },
}
