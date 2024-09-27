import { type FastifyInstance } from 'fastify'
import { type CookieSerializeOptions } from '@fastify/cookie'

import { z } from 'zod'
import jwt from 'jsonwebtoken'

import { prisma } from '~/lib/prisma'
import { env } from '~/env'

import { InvalidTokenProvidedError } from './_errors/invalid-token-provided'

interface JwtPayloadSchema {
  email: string
}

export async function createSessionRoute(app: FastifyInstance) {
  app.get('/sessions', async (request, reply) => {
    const createSessionQuerySchema = z.object({
      token: z.string(),
    })

    const { token: emailToken } = createSessionQuerySchema.parse(request.query)

    try {
      const tokenInfoByEmail = await prisma.authToken.findUnique({
        where: {
          token: emailToken,
        },
      })

      if (!tokenInfoByEmail) {
        throw new InvalidTokenProvidedError()
      }

      const { email } = jwt.verify(
        emailToken,
        env.JWT_SECRET,
      ) as JwtPayloadSchema

      const userByTokenEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      const isInvalidatedToken =
        tokenInfoByEmail.invalidated_at || !userByTokenEmail

      if (isInvalidatedToken) {
        throw new InvalidTokenProvidedError()
      }

      await prisma.authToken.update({
        where: {
          token: emailToken,
        },

        data: {
          invalidated_at: new Date(),
        },
      })

      const authToken = jwt.sign({ sub: userByTokenEmail.id }, env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
      })

      const authCookieOptions: CookieSerializeOptions = {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        path: '/',
      }

      return reply
        .status(308)
        .setCookie(env.AUTH_COOKIE_NAME, authToken, authCookieOptions)
        .redirect(env.AUTH_REDIRECT_URL)
    } catch (error) {
      // TODO: Handle errors

      return error
    }
  })
}
