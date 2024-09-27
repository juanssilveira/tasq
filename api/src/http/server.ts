import fastify from 'fastify'

import cookies from '@fastify/cookie'
import cors from '@fastify/cors'

import { authWithLinkRoute } from './routes/auth-with-link'
import { createSessionRoute } from './routes/create-session'
import { signOutRoute } from './routes/sign-out'
import { createTaskRoute } from './routes/create-task'
import { getAllTasksRoute } from './routes/get-all-tasks'
import { getTaskRoute } from './routes/get-task'
import { deleteTaskRoute } from './routes/delete-task'
import { startTaskRoute } from './routes/start-task'
import { completeTaskRoute } from './routes/complete-task'
import { getUserProfileRoute } from './routes/get-user-profile'

import { env } from '~/env'

const app = fastify()

app.register(cors, {
  origin: [env.FRONTEND_URL],
  credentials: true,
})

app.register(cookies)

app.register(authWithLinkRoute)
app.register(createSessionRoute)
app.register(signOutRoute)
app.register(createTaskRoute)
app.register(getAllTasksRoute)
app.register(getTaskRoute)
app.register(deleteTaskRoute)
app.register(startTaskRoute)
app.register(completeTaskRoute)
app.register(getUserProfileRoute)

app.setErrorHandler((error) => {
  console.log(error)
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('🎉 HTTP Server is running.')
  })
