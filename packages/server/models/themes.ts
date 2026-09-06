import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize'
import { sequelize } from '../db'

export class LocalUser extends Model<
  InferAttributes<LocalUser>,
  InferCreationAttributes<LocalUser>
> {
  declare id: number
}

export class SiteTheme extends Model<
  InferAttributes<SiteTheme>,
  InferCreationAttributes<SiteTheme>
> {
  declare id: CreationOptional<number>
  declare theme: string
  declare description: string
}

export class UserTheme extends Model<
  InferAttributes<UserTheme>,
  InferCreationAttributes<UserTheme>
> {
  declare ownerId: number
  declare themeId: number
  declare siteTheme?: NonAttribute<SiteTheme>
}

LocalUser.init(
  { id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false } },
  { sequelize, tableName: 'local_users', timestamps: false }
)

SiteTheme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    theme: { type: DataTypes.STRING(32), allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: 'site_themes',
    timestamps: false,
    indexes: [
      { fields: ['theme'], unique: true, name: 'site_themes_theme_unique' },
    ],
  }
)

UserTheme.init(
  {
    ownerId: {
      type: DataTypes.INTEGER,
      field: 'owner_id',
      primaryKey: true,
      allowNull: false,
      references: { model: LocalUser, key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    themeId: {
      type: DataTypes.INTEGER,
      field: 'theme_id',
      allowNull: false,
      references: { model: SiteTheme, key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    sequelize,
    tableName: 'user_themes',
    timestamps: false,
    indexes: [{ fields: ['theme_id'], name: 'user_themes_theme_id' }],
  }
)

UserTheme.belongsTo(LocalUser, { foreignKey: 'ownerId', as: 'owner' })
LocalUser.hasOne(UserTheme, { foreignKey: 'ownerId', as: 'themePreference' })
UserTheme.belongsTo(SiteTheme, { foreignKey: 'themeId', as: 'siteTheme' })
SiteTheme.hasMany(UserTheme, { foreignKey: 'themeId', as: 'preferences' })
