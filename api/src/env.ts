import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
  JWT_SECRET: z.string(),
  COOKIES_SECRET: z.string(),

  API_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  AUTH_COOKIE_NAME: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  throw new Error('❌ Invalid enviroment vriables setup!')
}

export const env = _env.data
