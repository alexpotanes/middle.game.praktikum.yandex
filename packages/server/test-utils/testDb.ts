import { sequelize } from '../models'

// Поднимает чистую схему на sqlite in-memory (см. db/sequelize.ts - там
// подмена на sqlite происходит по NODE_ENV=test, который выставляет jest).
export const resetDb = () => sequelize.sync({ force: true })
