import { type FastifyInstance } from 'fastify'

import { env } from '~/env'

export async function signOutRoute(app: FastifyInstance) {
  app.get('/sign-out', async (_, reply) => {
    const tokenCookieName = env.AUTH_COOKIE_NAME

    return reply.status(204).clearCookie(tokenCookieName).send()
  })
}
