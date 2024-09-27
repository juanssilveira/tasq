import { api } from '@/lib/axios'

interface Task {
  id: string
  title: string
  user_id: string
  started_at: Date | null
  completed_at: Date | null
  created_at: Date
  updated_at: Date
}

interface GetAllTasksResponse {
  tasks: Task[]
}

export async function getAllTasks() {
  return await api.get<GetAllTasksResponse>('/tasks?orderBy=date&order=desc')
}
