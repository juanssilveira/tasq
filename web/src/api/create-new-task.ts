import { api } from '@/lib/axios'

interface CreateNewTaskRequest {
  title: string
}

export async function createNewTask({ title }: CreateNewTaskRequest) {
  return await api.post('/tasks', {
    title,
  })
}
