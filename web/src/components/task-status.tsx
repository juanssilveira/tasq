import { tv } from 'tailwind-variants'

interface TaskStatusProps {
  variant: 'pending' | 'progress' | 'completed'
}

const taskStatusIcon = tv({
  base: 'h-2 w-2 rounded-full',
  variants: {
    variant: {
      pending: 'bg-orange-500',
      progress: 'bg-blue-500',
      completed: 'bg-green-500',
    },
  },
})

const taskLabels = {
  pending: 'Pending',
  progress: 'In progress',
  completed: 'Completed',
}

export function TaskStatus({ variant }: TaskStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={taskStatusIcon({ variant })} />

      <span className="text-muted-foreground font-medium">
        {taskLabels[variant]}
      </span>
    </div>
  )
}
