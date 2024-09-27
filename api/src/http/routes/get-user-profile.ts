import { type FastifyInstance } from 'fastify'

import { checkSession } from '../middlewares/check-session'
import { ResourceNotFoundError } from './_errors/resource-not-found'

import { prisma } from '~/lib/prisma'

export async function getUserProfileRoute(app: FastifyInstance) {
  app.get(
    '/me',
    {
      preHandler: [checkSession],
    },
    async (request) => {
      const { userId } = request

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        throw new ResourceNotFoundError()
      }

      return {
        user,
      }
    },
  )
}
