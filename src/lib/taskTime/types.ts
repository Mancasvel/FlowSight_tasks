export type Task = {
  id: string
  name: string
  createdAt: string
}

export type WorkSession = {
  id: string
  taskId: string
  startedAt: string
  endedAt: string | null
}

export type TaskTimePersisted = {
  tasks: Task[]
  sessions: WorkSession[]
}

export const STORAGE_KEY = 'flowsight_task_time_v1'
