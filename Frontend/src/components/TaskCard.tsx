import { Task, TaskStatus } from '../types';
import { Button, StatusBadge } from './ui';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onImproveDescription: (taskId: string) => void;
  onViewLogs: (taskId: string) => void;
  actionLoading: Record<string, boolean>;
  isLogsActive: boolean;
}

const nextStatusLabel: Record<TaskStatus, { label: string; status?: TaskStatus }> = {
  TODO: { label: 'Start', status: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Complete', status: 'DONE' },
  DONE: { label: 'Done' }
};

export const TaskCard = ({
  task,
  onUpdateStatus,
  onDelete,
  onImproveDescription,
  onViewLogs,
  actionLoading,
  isLogsActive
}: TaskCardProps) => {
  const nextStatus = nextStatusLabel[task.status];

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-actions">
        {nextStatus.status && (
          <Button
            onClick={() => onUpdateStatus(task)}
            disabled={actionLoading[task._id + '-status']}
            variant="secondary"
          >
            {nextStatus.status === 'IN_PROGRESS' ? '▶️' : '✅'} {actionLoading[task._id + '-status'] ? 'Updating...' : nextStatus.label}
          </Button>
        )}
        <Button
          onClick={() => onImproveDescription(task._id)}
          disabled={actionLoading[task._id + '-improve']}
          variant="secondary"
        >
          🤖 {actionLoading[task._id + '-improve'] ? 'Improving...' : 'AI Improve'}
        </Button>
        <Button
          onClick={() => onViewLogs(task._id)}
          disabled={actionLoading[task._id + '-logs']}
          variant="secondary"
        >
          📊 {actionLoading[task._id + '-logs'] ? 'Loading...' : (isLogsActive ? 'Hide Logs' : 'View Logs')}
        </Button>
        <Button
          onClick={() => onDelete(task._id)}
          disabled={actionLoading[task._id + '-delete']}
          variant="danger"
        >
          🗑️ {actionLoading[task._id + '-delete'] ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
};