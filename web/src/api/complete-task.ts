import { api } from '@/lib/axios'

interface CompleteTaskRequest {
  id: string
}

export async function completeTask({ id }: CompleteTaskRequest) {
  return await api.post(`/tasks/${id}/complete`)
}
