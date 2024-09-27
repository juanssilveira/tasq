import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { env } from '~/env'

interface JwtPayloadSchema {
  sub: string
}

export async function checkSession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authToken = request.cookies['@tasq:auth']

  if (!authToken) {
    return reply.status(401).send()
  }

  try {
    const { sub } = jwt.verify(authToken, env.JWT_SECRET) as JwtPayloadSchema

    request.userId = sub
  } catch (error) {
    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError
    ) {
      const tokenCookieName = env.AUTH_COOKIE_NAME

      return reply.status(401).clearCookie(tokenCookieName).send()
    }

    return error
  }
}
