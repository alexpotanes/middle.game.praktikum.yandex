module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      const options = { transaction }
      // Только проверенный ID из API Практикума, без копии персональных данных.
      await queryInterface.createTable(
        'local_users',
        { id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false } },
        options
      )
      await queryInterface.createTable(
        'site_themes',
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
          },
          theme: { type: Sequelize.STRING(32), allowNull: false },
          description: { type: Sequelize.STRING, allowNull: false },
        },
        options
      )
      await queryInterface.addIndex('site_themes', ['theme'], {
        ...options,
        unique: true,
        name: 'site_themes_theme_unique',
      })
      await queryInterface.createTable(
        'user_themes',
        {
          owner_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: { model: 'local_users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          theme_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'site_themes', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
        },
        options
      )
      // owner_id уже индексирован первичным ключом.
      await queryInterface.addIndex('user_themes', ['theme_id'], {
        ...options,
        name: 'user_themes_theme_id',
      })
      await queryInterface.bulkInsert(
        'site_themes',
        [
          { theme: 'light', description: 'Светлая' },
          { theme: 'dark', description: 'Тёмная' },
        ],
        options
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable('user_themes', { transaction })
      await queryInterface.dropTable('site_themes', { transaction })
      await queryInterface.dropTable('local_users', { transaction })
    })
  },
}
