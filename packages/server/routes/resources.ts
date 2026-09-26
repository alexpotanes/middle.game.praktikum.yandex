import { Router } from 'express'

import { praktikumFetch, withCookie } from '../services/praktikumApi'

export const resourcesRouter = Router()

resourcesRouter.get('/*', async (req, res) => {
  const resourcePath = req.originalUrl.replace(/^\/resources/, '')

  try {
    const upstream = await praktikumFetch(`/resources${resourcePath}`, {
      headers: withCookie(req.headers.cookie),
    })
    const contentType = upstream.headers.get('content-type')
    const cacheControl = upstream.headers.get('cache-control')
    const body = Buffer.from(await upstream.arrayBuffer())

    if (contentType) {
      res.setHeader('content-type', contentType)
    }

    if (cacheControl) {
      res.setHeader('cache-control', cacheControl)
    }

    res.status(upstream.status).send(body)
  } catch {
    res.status(502).json({ reason: 'Ошибка загрузки ресурса Практикума' })
  }
})
