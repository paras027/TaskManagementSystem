import { TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      {statusLabels[status]}
    </span>
  );
};