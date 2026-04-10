import { Task, ActivityLog } from '../types';
import { TaskCard } from './TaskCard';
import { ActivityLogs } from './ActivityLogs';

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onImproveDescription: (taskId: string) => void;
  onViewLogs: (taskId: string) => void;
  actionLoading: Record<string, boolean>;
  activeTaskLogs: ActivityLog[];
  activeTaskId: string | null;
}

export const TaskList = ({
  tasks,
  onUpdateStatus,
  onDelete,
  onImproveDescription,
  onViewLogs,
  actionLoading,
  activeTaskLogs,
  activeTaskId
}: TaskListProps) => {
  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className="task-item">
          <TaskCard
            task={task}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
            onImproveDescription={onImproveDescription}
            onViewLogs={onViewLogs}
            actionLoading={actionLoading}
            isLogsActive={activeTaskId === task._id}
          />
          {activeTaskId === task._id && (
            <ActivityLogs logs={activeTaskLogs} />
          )}
        </div>
      ))}
    </div>
  );
};