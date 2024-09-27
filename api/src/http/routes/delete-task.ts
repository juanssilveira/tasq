import { type FastifyInstance } from 'fastify'
import { z } from 'zod'

import { checkSession } from '../middlewares/check-session'

import { prisma } from '~/lib/prisma'

export async function deleteTaskRoute(app: FastifyInstance) {
  app.delete(
    '/tasks/:id',
    {
      preHandler: [checkSession],
    },
    async (request, reply) => {
      const { userId } = request

      const deleteTaskParamsSchema = z.object({
        id: z.string().cuid(),
      })

      const { id: taskId } = deleteTaskParamsSchema.parse(request.params)

      await prisma.task.delete({
        where: {
          user_id: userId,
          id: taskId,
        },
      })

      return reply.status(204).send()
    },
  )
}
