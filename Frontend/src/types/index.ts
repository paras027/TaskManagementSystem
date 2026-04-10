export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
  taskId: string;
  previousStatus: string;
  newStatus: string;
  changedAt: string;
  createdAt: string;
  updatedAt: string;
}