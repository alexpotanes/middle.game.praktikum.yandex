import { sequelize } from '../db/sequelize'

export { Topic } from './Topic'
export { Comment } from './Comment'
export { Reaction } from './Reaction'
export { sequelize }

export const syncModels = () => sequelize.sync()
