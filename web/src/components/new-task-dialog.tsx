import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { LucideCheckCheck } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { DialogFooter, DialogContent, DialogClose } from './ui/dialog'

import { createNewTask } from '@/api/create-new-task'

const createTaskFormSchema = z.object({
  title: z.string().min(1),
})

type CreateTaskFormSchema = z.infer<typeof createTaskFormSchema>

export function NewTaskDialog() {
  const queryClient = useQueryClient()

  const { handleSubmit, register, reset } = useForm<CreateTaskFormSchema>({
    resolver: zodResolver(createTaskFormSchema),
  })

  const { mutateAsync: mutateCreateTask } = useMutation({
    mutationKey: ['CREATE_NEW_TASK'],
    mutationFn: createNewTask,
  })

  async function handleCreateNewTask({ title }: CreateTaskFormSchema) {
    await mutateCreateTask({ title })

    await queryClient.invalidateQueries({
      queryKey: ['GET_ALL_TASKS'],
    })

    reset()
  }

  return (
    <DialogContent>
      <form
        onSubmit={handleSubmit(handleCreateNewTask)}
        className="flex flex-col gap-4 py-2"
      >
        <div className="flex flex-col gap-3">
          <Label htmlFor="title">Task title</Label>
          <Input
            id="title"
            {...register('title')}
            className="ring-offset-2 ring-offset-background"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" className="w-full gap-2">
              <LucideCheckCheck size={16} />
              Create task
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
