import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createTask,
  deleteTask,
  getTaskActivityLogs,
  getTasks,
  improveTaskDescription,
  updateTaskStatus
} from './services/api';
import { ActivityLog, Task, TaskStatus } from './types';

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
};

const nextStatusLabel: Record<TaskStatus, { label: string; status?: TaskStatus }> = {
  TODO: { label: 'Start', status: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Complete', status: 'DONE' },
  DONE: { label: 'Done' }
};

const filters: Array<{ key: TaskStatus | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'TODO', label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'DONE', label: 'Done' }
];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTaskLogs, setActiveTaskLogs] = useState<ActivityLog[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    if (selectedFilter === 'ALL') return tasks;
    return tasks.filter((task) => task.status === selectedFilter);
  }, [selectedFilter, tasks]);

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

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetError();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setActionLoading((current) => ({ ...current, create: true }));
    try {
      const created = await createTask(title.trim(), description.trim());
      setTasks((current) => [created, ...current]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError((err as Error).message);
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
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
        setActiveTaskLogs([]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading((current) => ({ ...current, [taskId + '-delete']: false }));
    }
  };

  const handleViewLogs = async (taskId: string) => {
    resetError();
    setActionLoading((current) => ({ ...current, [taskId + '-logs']: true }));
    try {
      const logs = await getTaskActivityLogs(taskId);
      setActiveTaskId(taskId);
      setActiveTaskLogs(logs);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading((current) => ({ ...current, [taskId + '-logs']: false }));
    }
  };

  const handleImproveDescription = async (taskId: string) => {
    resetError();
    setActionLoading((current) => ({ ...current, [taskId + '-improve']: true }));
    try {
      const improved = await improveTaskDescription(taskId);
      setTasks((current) => current.map((task) => (task._id === improved._id ? improved : task)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading((current) => ({ ...current, [taskId + '-improve']: false }));
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Task Management System</h1>
        <p>Manage workflows, track activity, and improve task descriptions with AI.</p>
      </header>

      <section className="status-bar">
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={selectedFilter === filter.key ? 'active' : ''}
            onClick={() => setSelectedFilter(filter.key)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </section>

      <main>
        <section className="task-form">
          <h2>Create a new task</h2>
          <form onSubmit={handleCreateTask}>
            <label>
              Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task title"
              />
            </label>
            <label>
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional description"
              />
            </label>
            <button type="submit" disabled={actionLoading.create || loading}>
              {actionLoading.create ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </section>

        <section className="task-list">
          <div className="task-list-header">
            <h2>Tasks</h2>
            <button type="button" onClick={loadTasks} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {error && <div className="error-box">{error}</div>}
          {loading && !tasks.length ? (
            <div className="empty-state">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">No tasks found for this filter.</div>
          ) : (
            <div className="task-grid">
              {filteredTasks.map((task) => {
                const statusAction = nextStatusLabel[task.status];
                const statusKey = task._id + '-status';
                const deleteKey = task._id + '-delete';
                const logsKey = task._id + '-logs';
                const improveKey = task._id + '-improve';
                const isStatusBusy = actionLoading[statusKey];
                const isDeleteBusy = actionLoading[deleteKey];
                const isLogsBusy = actionLoading[logsKey];
                const isImproveBusy = actionLoading[improveKey];

                return (
                  <article className="task-card" key={task._id}>
                    <div className="task-card-title">
                      <h3>{task.title}</h3>
                      <span className={`pill ${task.status.toLowerCase()}`}>{statusLabels[task.status]}</span>
                    </div>
                    <p>{task.description || 'No description provided.'}</p>
                    <div className="task-meta">
                      <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
                      <small>Updated: {new Date(task.updatedAt).toLocaleString()}</small>
                    </div>
                    <div className="task-actions">
                      {statusAction.status ? (
                        <button
                          type="button"
                          disabled={isStatusBusy}
                          onClick={() => handleUpdateStatus(task)}
                        >
                          {isStatusBusy ? 'Updating…' : statusAction.label}
                        </button>
                      ) : (
                        <button type="button" disabled>
                          {statusAction.label}
                        </button>
                      )}
                      <button type="button" disabled={isImproveBusy} onClick={() => handleImproveDescription(task._id)}>
                        {isImproveBusy ? 'Improving…' : 'Improve Description'}
                      </button>
                      <button type="button" disabled={isLogsBusy} onClick={() => handleViewLogs(task._id)}>
                        {isLogsBusy ? 'Loading…' : 'View Logs'}
                      </button>
                      <button type="button" className="danger" disabled={isDeleteBusy} onClick={() => handleDeleteTask(task._id)}>
                        {isDeleteBusy ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="task-logs">
          <h2>Activity Logs</h2>
          {activeTaskId ? (
            activeTaskLogs.length > 0 ? (
              <ul>
                {activeTaskLogs.map((log) => (
                  <li key={log._id}>
                    <strong>{log.previousStatus}</strong> → <strong>{log.newStatus}</strong>
                    <span>{new Date(log.changedAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">Select a task and click View Logs to load activity history.</div>
            )
          ) : (
            <div className="empty-state">Select a task and click View Logs to load activity history.</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
