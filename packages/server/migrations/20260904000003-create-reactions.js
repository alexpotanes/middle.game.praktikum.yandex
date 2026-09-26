'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'comments', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      emoji: {
        type: Sequelize.STRING(32),
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

    await queryInterface.addIndex('reactions', ['commentId'])
    await queryInterface.addIndex(
      'reactions',
      ['commentId', 'userId', 'emoji'],
      {
        unique: true,
        name: 'reactions_comment_user_emoji_unique',
      }
    )
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reactions')
  },
}
