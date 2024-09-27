import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LucideLoader2, LucideLogIn } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signIn } from '@/api/sign-in'

const authFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email field is required.')
    .email('This is not a valid email.'),
})

type AuthFormSchema = z.infer<typeof authFormSchema>

export function SignIn() {
  const { handleSubmit, register, reset, formState } = useForm<AuthFormSchema>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationKey: ['SEND_AUTH_LINK'],
    mutationFn: signIn,
  })

  async function handleAuthenticate({ email }: AuthFormSchema) {
    try {
      await authenticate({ email })

      toast.success('E-mail enviado! Verifique sua caixa de spam.')

      reset()
    } catch {}
  }

  return (
    <>
      <div className="mx-auto flex h-screen max-w-80 flex-col items-center justify-center gap-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">tasq.fun</h2>

          <p className="text-md text-muted-foreground">
            A simple task managment application.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleAuthenticate)}
          className="flex w-full flex-col space-y-4"
        >
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="email-input">Your email</Label>

            <Input
              id="email-input"
              disabled={formState.isSubmitting}
              {...register('email')}
            />
          </div>

          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="gap-2"
          >
            {formState.isSubmitting ? (
              <LucideLoader2 size={16} className="animate-spin" />
            ) : (
              <LucideLogIn size={16} />
            )}

            <span>Login</span>
          </Button>
        </form>

        <footer className="text-balance text-center text-sm leading-relaxed text-muted-foreground/40">
          <span>By clicking continue, you agree to our</span>{' '}
          <span>
            <span className="underline underline-offset-4">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="underline underline-offset-4">Privacy Policy</span>
            .
          </span>
        </footer>
      </div>

      <Helmet title="Login" />
    </>
  )
}
