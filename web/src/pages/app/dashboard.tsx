import { Helmet } from 'react-helmet-async'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'

import {
  LucideCalendar,
  LucideCheckCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideChevronsRight,
  LucideListStart,
  LucidePlus,
  LucideSearch,
  LucideTrash,
  LucideX,
} from 'lucide-react'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { NewTaskDialog } from '@/components/new-task-dialog'
import { TaskStatus } from '@/components/task-status'

import { getAllTasks } from '@/api/get-all-tasks'
import { startTask } from '@/api/start-task'
import { completeTask } from '@/api/complete-task'
import { deleteTask } from '@/api/delete-task'

export function Dashboard() {
  const queryClient = useQueryClient()

  const { data: allTasksResponse } = useQuery({
    queryKey: ['GET_ALL_TASKS'],
    queryFn: getAllTasks,
  })

  const { mutateAsync: mutateStartTask } = useMutation({
    mutationKey: ['START_TASK'],
    mutationFn: startTask,
  })

  const { mutateAsync: mutateCompleteTask } = useMutation({
    mutationKey: ['COMPLETE_TASK'],
    mutationFn: completeTask,
  })

  const { mutateAsync: mutateDeleteTask } = useMutation({
    mutationKey: ['DELETE_TASK'],
    mutationFn: deleteTask,
  })

  if (!allTasksResponse) {
    return null
  }

  const { tasks } = allTasksResponse.data

  async function invalidateAllTasksQuery() {
    await queryClient.invalidateQueries({
      queryKey: ['GET_ALL_TASKS'],
    })
  }

  async function handleCompleteTask(id: string) {
    await mutateCompleteTask({ id })
    await invalidateAllTasksQuery()
  }

  async function handleStartTask(id: string) {
    await mutateStartTask({ id })
    await invalidateAllTasksQuery()
  }

  async function handleDeleteTask(id: string) {
    await mutateDeleteTask({ id })
    await invalidateAllTasksQuery()
  }

  return (
    <>
      <div className="mx-auto my-8 max-w-[1216px]">
        <div className="flex items-center justify-start gap-3">
          <Input placeholder="Search tasks..." className="max-w-72" disabled />

          <Button variant="secondary" className="flex gap-2" disabled>
            <LucideSearch size={16} />
            <span>Search</span>
          </Button>

          <Button variant="outline" className="flex gap-2" disabled>
            <LucideX size={16} />
            <span>Clear search</span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="ml-auto flex gap-2">
                <LucidePlus size={16} />
                <span>New task</span>
              </Button>
            </DialogTrigger>

            <NewTaskDialog />
          </Dialog>
        </div>

        <div className="mt-5 rounded-md border border-foreground/20">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20">
                  <Checkbox className="h-4 w-4 rounded-sm border-foreground/30" />
                </TableHead>

                <TableHead className="w-1/4">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>

                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tasks.map((task) => {
                return (
                  <TableRow key={task.id}>
                    <TableCell className="w-20">
                      <Checkbox className="h-4 w-4 rounded-sm border-foreground/30" />
                    </TableCell>

                    <TableCell className="w-1/4">{task.title}</TableCell>

                    <TableCell>
                      {task.completed_at && <TaskStatus variant="completed" />}

                      {!task.completed_at && task.started_at && (
                        <TaskStatus variant="progress" />
                      )}

                      {!task.completed_at && !task.started_at && (
                        <TaskStatus variant="pending" />
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <LucideCalendar size={14} />

                        <span>
                          {formatDistanceToNow(new Date(task.created_at), {
                            addSuffix: true,
                            locale: enUS,
                          })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-3">
                        {!task.completed_at && task.started_at && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex gap-2"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <LucideCheckCheck size={16} />
                            <span>Complete task</span>
                          </Button>
                        )}

                        {!task.completed_at && !task.started_at && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex gap-2"
                            onClick={() => handleStartTask(task.id)}
                          >
                            <LucideListStart size={16} />
                            <span>Start task</span>
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="flex gap-2"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <LucideTrash size={16} />
                          <span>Delete task</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              Showing {tasks.length} of {tasks.length} item(s)
            </span>

            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>Page 1 of 1 page(s)</span>
          </div>

          <div>
            <Pagination>
              <PaginationContent>
                <div className="flex items-center gap-2">
                  <PaginationItem>
                    <Button variant="outline" size="icon" disabled>
                      <LucideChevronsLeft size={16} />
                    </Button>
                  </PaginationItem>

                  <PaginationItem>
                    <Button variant="outline" size="icon" disabled>
                      <LucideChevronLeft size={16} />
                    </Button>
                  </PaginationItem>

                  <PaginationItem>
                    <Button variant="outline" size="icon" disabled>
                      <LucideChevronRight size={16} />
                    </Button>
                  </PaginationItem>

                  <PaginationItem>
                    <Button variant="outline" size="icon" disabled>
                      <LucideChevronsRight size={16} />
                    </Button>
                  </PaginationItem>
                </div>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      <Helmet title="Dashboard" />
    </>
  )
}
