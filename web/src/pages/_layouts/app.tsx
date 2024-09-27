import { useLayoutEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'

import { Header } from '@/components/header'
import { api } from '@/lib/axios'

export function AppLayout() {
  const navigate = useNavigate()

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          // const code = error.response?.data.code

          if (status === 401) {
            navigate('/auth', {
              replace: true,
            })
          }
        }

        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
