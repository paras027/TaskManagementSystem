import { useEffect, useMemo, useState } from 'react';
import {
  createTask,
  deleteTask,
  getTaskActivityLogs,
  getTasks,
  improveTaskDescription,
  updateTaskStatus
} from '../services/api';
import { ActivityLog, Task, TaskStatus } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTaskLogs, setActiveTaskLogs] = useState<ActivityLog[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const resetError = () => setError(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (title: string, description: string): Promise<boolean> => {
    resetError();
    if (!title.trim()) {
      setError('Task title is required.');
      return false;
    }

    setActionLoading((current) => ({ ...current, create: true }));
    try {
      const created = await createTask(title.trim(), description.trim());
      setTasks((current) => [created, ...current]);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setActionLoading((current) => ({ ...current, create: false }));
    }
  };

  const handleUpdateStatus = async (task: Task) => {
    resetError();
    if (!task) return;
    const nextStatus = nextStatusLabel[task.status].status;
    if (!nextStatus) return;

    setActionLoading((current) => ({ ...current, [task._id + '-status']: true }));
    try {
      const updated = await updateTaskStatus(task._id, nextStatus);
      setTasks((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading((current) => ({ ...current, [task._id + '-status']: false }));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    resetError();
    setActionLoading((current) => ({ ...current, [taskId + '-delete']: true }));
    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading((current) => ({ ...current, [taskId + '-delete']: false }));
    }
  };

  const handleImproveDescription = async (taskId: string) => {
    resetError();
    setActionLoading((current) => ({ ...current, [taskId + '-improve']: true }));
    try {
      const updated = await improveTaskDescription(taskId);
      setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading((current) => ({ ...current, [taskId + '-improve']: false }));
    }
  };

  const handleViewLogs = async (taskId: string) => {
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
      setActiveTaskLogs([]);
      return;
    }

    resetError();
    setActionLoading((current) => ({ ...current, [taskId + '-logs']: true }));
    try {
      const logs = await getTaskActivityLogs(taskId);
      setActiveTaskLogs(logs);
      setActiveTaskId(taskId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading((current) => ({ ...current, [taskId + '-logs']: false }));
    }
  };

  return {
    tasks,
    loading,
    actionLoading,
    error,
    activeTaskLogs,
    activeTaskId,
    handleCreateTask,
    handleUpdateStatus,
    handleDeleteTask,
    handleImproveDescription,
    handleViewLogs,
    resetError
  };
};

const nextStatusLabel: Record<TaskStatus, { label: string; status?: TaskStatus }> = {
  TODO: { label: 'Start', status: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Complete', status: 'DONE' },
  DONE: { label: 'Done' }
};