import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import type { Optional } from 'sequelize'
import { Comment } from './Comment'

export interface ReactionAttributes {
  id: number
  commentId: number
  userId: number
  emoji: string
  createdAt: Date
  updatedAt: Date
}

type ReactionCreationAttributes = Optional<
  ReactionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

@Table({ modelName: 'Reaction', tableName: 'reactions' })
export class Reaction extends Model<
  ReactionAttributes,
  ReactionCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @ForeignKey(() => Comment)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare commentId: number

  @BelongsTo(() => Comment, { foreignKey: 'commentId', as: 'comment' })
  declare comment?: Comment

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare userId: number

  @AllowNull(false)
  @Column(DataType.STRING(32))
  declare emoji: string

  @CreatedAt
  declare readonly createdAt: Date

  @UpdatedAt
  declare readonly updatedAt: Date
}
