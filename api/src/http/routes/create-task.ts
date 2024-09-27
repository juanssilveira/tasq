import { type FastifyInstance } from 'fastify'
import { z } from 'zod'

import { checkSession } from '../middlewares/check-session'

import { prisma } from '~/lib/prisma'

export async function createTaskRoute(app: FastifyInstance) {
  app.post(
    '/tasks',
    {
      preHandler: [checkSession],
    },
    async (request, reply) => {
      const { userId } = request

      const createTaskBodySchema = z.object({
        title: z.string().min(1),
      })

      const { title } = createTaskBodySchema.parse(request.body)

      try {
        await prisma.task.create({
          data: {
            title,
            user_id: userId,
          },
        })

        return reply.status(201).send()
      } catch {} // TODO: Handle errors
    },
  )
}
