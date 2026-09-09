import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import type { Optional } from 'sequelize'
import { Comment } from './Comment'

export interface TopicAttributes {
  id: number
  title: string
  message: string
  authorId: number
  authorLogin: string
  createdAt: Date
  updatedAt: Date
}

type TopicCreationAttributes = Optional<
  TopicAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

@Table({ modelName: 'Topic', tableName: 'topics' })
export class Topic extends Model<TopicAttributes, TopicCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    validate: {
      notEmpty: { msg: 'Заголовок топика не может быть пустым' },
      len: {
        args: [1, 200],
        msg: 'Заголовок топика должен быть от 1 до 200 символов',
      },
    },
  })
  declare title: string

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    validate: {
      notEmpty: { msg: 'Текст топика не может быть пустым' },
      len: {
        args: [1, 10000],
        msg: 'Текст топика не может превышать 10000 символов',
      },
    },
  })
  declare message: string

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare authorId: number

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare authorLogin: string

  @CreatedAt
  declare readonly createdAt: Date

  @UpdatedAt
  declare readonly updatedAt: Date

  @HasMany(() => Comment, { foreignKey: 'topicId', as: 'comments' })
  declare comments?: Comment[]
}
