import { api } from '@/lib/axios'

interface StartTaskRequest {
  id: string
}

export async function startTask({ id }: StartTaskRequest) {
  return await api.post(`/tasks/${id}/start`)
}
