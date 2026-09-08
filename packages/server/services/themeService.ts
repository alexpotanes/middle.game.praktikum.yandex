import { sequelize } from '../db/sequelize'
import { LocalUser, SiteTheme, UserTheme } from '../models/themes'
import { NotFoundError } from '../utils/errors'

export const listThemes = () => SiteTheme.findAll({ order: [['id', 'ASC']] })

export const findTheme = async (theme: string) => {
  const result = await SiteTheme.findOne({ where: { theme } })
  if (!result) throw new NotFoundError('Тема не найдена')
  return result
}

export const getCurrentTheme = async (
  ownerId: number | null,
  guestTheme: string
) => {
  if (ownerId !== null) {
    const preference = await UserTheme.findByPk(ownerId, {
      include: [{ model: SiteTheme, as: 'siteTheme', required: true }],
    })
    if (preference?.siteTheme) return preference.siteTheme
    return findTheme('light')
  }

  const preference = await SiteTheme.findOne({ where: { theme: guestTheme } })
  return preference ?? findTheme('light')
}

export const setCurrentTheme = async (
  ownerId: number | null,
  theme: string
) => {
  const selected = await findTheme(theme)
  if (ownerId !== null) {
    await sequelize.transaction(async transaction => {
      await LocalUser.upsert({ id: ownerId }, { transaction })
      await UserTheme.upsert({ ownerId, themeId: selected.id }, { transaction })
    })
  }
  return selected
}
