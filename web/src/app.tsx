import { Helmet, HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/reactQuery'
import { Toaster } from '@/components/toaster'

import { ThemeProvider } from '@/contexts/theme-context'
import { Router } from '@/router'

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | tasq.fun" />

      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
