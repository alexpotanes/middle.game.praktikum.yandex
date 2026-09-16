import * as authService from './authService'
import { BadGatewayError } from '../utils/errors'
import type { SessionInfo, SessionVerifier } from '../middleware/auth'

export const verifyPraktikumSession: SessionVerifier = async cookie => {
  if (!cookie) {
    return null
  }

  let result
  try {
    result = await authService.getUser(cookie)
  } catch {
    throw new BadGatewayError('Ошибка обращения к API Практикума')
  }

  if (result.status === 200) {
    return result.data as SessionInfo
  }

  if (result.status === 401 || result.status === 403) {
    return null
  }

  throw new BadGatewayError('Ошибка обращения к API Практикума')
}
