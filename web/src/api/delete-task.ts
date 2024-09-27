import { api } from '@/lib/axios'

interface DeleteTaskRequest {
  id: string
}

export async function deleteTask({ id }: DeleteTaskRequest) {
  await api.delete(`/tasks/${id}`)
}
