import { type FastifyInstance } from 'fastify'
import { z } from 'zod'

import { checkSession } from '../middlewares/check-session'

import { prisma } from '~/lib/prisma'

export async function getAllTasksRoute(app: FastifyInstance) {
  app.get(
    '/tasks',
    {
      preHandler: [checkSession],
    },
    async (request) => {
      const { userId } = request

      const getAllTasksQuerySchema = z.object({
        orderBy: z.enum(['date']).default('date'),
        order: z.enum(['asc', 'desc']).optional(),
      })

      const { orderBy, order } = getAllTasksQuerySchema.parse(request.query)

      const data = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          tasks: {
            orderBy:
              orderBy === 'date'
                ? {
                    created_at: order,
                  }
                : {},
          },
        },
      })

      return {
        tasks: data?.tasks || [],
      }
    },
  )
}
