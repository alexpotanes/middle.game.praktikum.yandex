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

    await queryInterface.addConstraint('comments', {
      fields: ['topicId', 'id'],
      type: 'unique',
      name: 'comments_topic_id_id_unique',
    })

    await queryInterface.addConstraint('comments', {
      fields: ['topicId', 'parentId'],
      type: 'foreign key',
      name: 'comments_parent_topic_fk',
      references: {
        table: 'comments',
        fields: ['topicId', 'id'],
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comments')
  },
}
