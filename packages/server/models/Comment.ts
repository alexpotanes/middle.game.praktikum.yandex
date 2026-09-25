import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import type { Optional } from 'sequelize'
import { Topic } from './Topic'
import { Reaction } from './Reaction'

export interface CommentAttributes {
  id: number
  topicId: number
  parentId: number | null
  authorId: number
  authorLogin: string
  message: string
  createdAt: Date
  updatedAt: Date
}

type CommentCreationAttributes = Optional<
  CommentAttributes,
  'id' | 'parentId' | 'createdAt' | 'updatedAt'
>

@Table({ modelName: 'Comment', tableName: 'comments' })
export class Comment extends Model<
  CommentAttributes,
  CommentCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @ForeignKey(() => Topic)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare topicId: number

  @BelongsTo(() => Topic, { foreignKey: 'topicId', as: 'topic' })
  declare topic?: Topic

  @ForeignKey(() => Comment)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare parentId: number | null

  @BelongsTo(() => Comment, { foreignKey: 'parentId', as: 'parent' })
  declare parent?: Comment

  @HasMany(() => Comment, { foreignKey: 'parentId', as: 'replies' })
  declare replies?: Comment[]

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare authorId: number

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare authorLogin: string

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    validate: {
      notEmpty: { msg: 'Комментарий не может быть пустым' },
      len: {
        args: [1, 5000],
        msg: 'Комментарий не может превышать 5000 символов',
      },
    },
  })
  declare message: string

  @CreatedAt
  declare readonly createdAt: Date

  @UpdatedAt
  declare readonly updatedAt: Date

  @HasMany(() => Reaction, { foreignKey: 'commentId', as: 'reactions' })
  declare reactions?: Reaction[]
}
