import { Toaster as RootToaster } from 'sonner'

import { useTheme } from '@/contexts/theme-context'

export function Toaster() {
  const { theme } = useTheme()

  return (
    <RootToaster position="bottom-left" theme={theme} richColors closeButton />
  )
}
