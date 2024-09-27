import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AppLayout } from '@/pages/_layouts/app'

import { SignIn } from '@/pages/auth/sign-in'
import { Dashboard } from '@/pages/app/dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/auth',
    element: <SignIn />,
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
