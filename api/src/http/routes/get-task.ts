import { type FastifyInstance } from 'fastify'
import { z } from 'zod'

import { checkSession } from '../middlewares/check-session'
import { ResourceNotFoundError } from './_errors/resource-not-found'

import { prisma } from '~/lib/prisma'

export async function getTaskRoute(app: FastifyInstance) {
  app.get(
    '/tasks/:id',
    {
      preHandler: [checkSession],
    },
    async (request) => {
      const { userId } = request

      const getUniqueTaskParamsSchema = z.object({
        id: z.string().cuid(),
      })

      const { id: taskId } = getUniqueTaskParamsSchema.parse(request.params)

      const task = await prisma.task.findUnique({
        where: {
          user_id: userId,
          id: taskId,
        },
      })

      if (!task) {
        throw new ResourceNotFoundError()
      }

      return {
        task,
      }
    },
  )
}
