import { api } from '@/lib/axios'

interface GetUserProfileReponse {
  user: {
    id: string
    name: string
    email: string
    created_at: Date
    updated_at: Date
  }
}

export async function getUserProfile() {
  return await api.get<GetUserProfileReponse>('/me')
}
