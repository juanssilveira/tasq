import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LucideChevronDown, LucideLogOut } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

import { Button } from './ui/button'

import { getUserProfile } from '@/api/get-user-profile'
import { signOut } from '@/api/sign-out'
import { ThemeChanger } from './theme-changer'

export function Header() {
  const queryClient = useQueryClient()

  const { data: userProfileResponse } = useQuery({
    queryKey: ['GET_USER_PROFILE'],
    queryFn: getUserProfile,
  })

  const { mutateAsync: logout } = useMutation({
    mutationKey: ['LOGOUT_USER'],
    mutationFn: signOut,
  })

  if (!userProfileResponse) {
    return null
  }

  async function handleLogout() {
    await logout()

    await queryClient.resetQueries()
  }

  const { user } = userProfileResponse.data

  return (
    <header className="border-b border-foreground/10 p-6">
      <div className="mx-auto flex max-w-[1216px] items-center justify-between">
        <span className="font-bold tracking-tight text-foreground">
          tasq.fun
        </span>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-40 flex items-center justify-between gap-2"
              >
                <span className="flex flex-col items-start gap-1">
                  <span className="text-sm">{user.name}</span>
                </span>

                <LucideChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="mt-2 w-40">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LucideLogOut className="mr-2 size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeChanger />
        </div>
      </div>
    </header>
  )
}
