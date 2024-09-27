import { type FastifyInstance } from 'fastify'

import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'
import jwt from 'jsonwebtoken'

import { ResourceNotFoundError } from './_errors/resource-not-found'

import { prisma } from '~/lib/prisma'
import { resend } from '~/lib/resend'

import { env } from '~/env'

export async function authWithLinkRoute(app: FastifyInstance) {
  app.post('/auth', async (request, reply) => {
    const authWithLinkBodySchema = z.object({
      email: z.string().email(),
    })

    const { email } = authWithLinkBodySchema.parse(request.body)

    const registeredUser = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!registeredUser) {
      throw new ResourceNotFoundError()
    }

    const authLinkToken = jwt.sign({ email }, env.JWT_SECRET, {
      expiresIn: '10h', // 10 hours
    })

    const authLink = new URL('/sessions', env.API_URL)

    authLink.searchParams.set('token', authLinkToken)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    try {
      await prisma.authToken.updateMany({
        where: {
          email,
          invalidated_at: null,
        },

        data: {
          invalidated_at: new Date(),
        },
      })

      await prisma.authToken.create({
        data: {
          id: createId(),
          token: authLinkToken,
          email,
        },
      })

      await resend.emails.send({
        from: 'hi@tasq.fun',
        to: email,
        subject: 'Login into your tasq account',
        html: `<a href="${authLink}">Click to Login</a>`,
      })

      console.log(authLink.href)

      return reply.status(200).send()
    } catch {} // TODO: Handle errors
  })
}
