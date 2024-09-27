import { type FastifyInstance } from 'fastify'
import { z } from 'zod'

import { checkSession } from '../middlewares/check-session'
import { ResourceNotFoundError } from './_errors/resource-not-found'

import { prisma } from '~/lib/prisma'

export async function completeTaskRoute(app: FastifyInstance) {
  app.post(
    '/tasks/:id/complete',
    {
      preHandler: [checkSession],
    },
    async (request, reply) => {
      const { userId } = request

      const completeTaskParamsSchema = z.object({
        id: z.string().cuid(),
      })

      const { id: taskId } = completeTaskParamsSchema.parse(request.params)

      const task = await prisma.task.findUnique({
        where: {
          user_id: userId,
          id: taskId,
        },
      })

      if (!task) {
        throw new ResourceNotFoundError()
      }

      if (task.completed_at) {
        return reply.status(409).send()
      }

      await prisma.task.update({
        where: {
          user_id: userId,
          id: taskId,
        },

        data: {
          completed_at: new Date(),
        },
      })

      return reply.status(204).send()
    },
  )
}
