import { Request, Response } from 'express'
import * as themeService from '../services/themeService'
import { resolveThemeOwner } from '../services/themeIdentity'
import { ValidationError } from '../utils/errors'

const GUEST_THEME_COOKIE = 'warchest_guest_theme'
const readGuestTheme = (req: Request) => {
  const value = req.headers.cookie
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${GUEST_THEME_COOKIE}=`))
    ?.slice(GUEST_THEME_COOKIE.length + 1)
  try {
    return value ? decodeURIComponent(value).slice(0, 32) : 'light'
  } catch {
    return 'light'
  }
}

export const list = async (_req: Request, res: Response) => {
  res.json(await themeService.listThemes())
}

export const getCurrent = async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store')
  const ownerId = await resolveThemeOwner(req.headers.cookie)
  res.json(await themeService.getCurrentTheme(ownerId, readGuestTheme(req)))
}

export const setCurrent = async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store')
  const body = req.body as unknown
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    Object.keys(body).length !== 1 ||
    !('theme' in body) ||
    typeof body.theme !== 'string' ||
    !/^[a-z][a-z0-9_-]{0,31}$/.test(body.theme)
  ) {
    throw new ValidationError(
      'Ожидается объект с единственным полем theme — названием темы'
    )
  }
  const ownerId = await resolveThemeOwner(req.headers.cookie)
  const selected = await themeService.setCurrentTheme(ownerId, body.theme)
  if (ownerId === null) {
    res.cookie(GUEST_THEME_COOKIE, selected.theme, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      path: '/',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    })
  }
  res.json(selected)
}
