import { useMemo, useState } from 'react';
import { TaskStatus } from '../types';
import { useTasks } from '../hooks/useTasks';
import { TaskForm, FilterButtons, TaskList } from '../components';
import { ErrorMessage, LoadingSpinner } from '../components/ui';

export const TaskManagementPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<TaskStatus | 'ALL'>('ALL');

  const {
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
  } = useTasks();

  const filteredTasks = useMemo(() => {
    if (selectedFilter === 'ALL') return tasks;
    return tasks.filter((task) => task.status === selectedFilter);
  }, [selectedFilter, tasks]);

  return (
    <div className="app">
      <header>
        <h1>Task Management System</h1>
      </header>

      <main>
        <TaskForm onSubmit={handleCreateTask} loading={actionLoading.create} />

        <section className="tasks-section">
          <h2>Tasks</h2>
          <FilterButtons selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

          {loading && <LoadingSpinner />}
          {error && (
            <ErrorMessage message={error} onDismiss={resetError} />
          )}

          <TaskList
            tasks={filteredTasks}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteTask}
            onImproveDescription={handleImproveDescription}
            onViewLogs={handleViewLogs}
            actionLoading={actionLoading}
            activeTaskLogs={activeTaskLogs}
            activeTaskId={activeTaskId}
          />
        </section>
      </main>
    </div>
  );
};