import { ActivityLog, Task, TaskStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (body as any)?.message || response.statusText || 'Something went wrong';
    throw new Error(message);
  }
  return body as T;
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  const body = await handleResponse<{ data: Task[] }>(response);
  return body.data;
};

export const createTask = async (title: string, description: string): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  const body = await handleResponse<{ data: Task }>(response);
  return body.data;
};

export const updateTaskStatus = async (id: string, newStatus: TaskStatus): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newStatus })
  });
  const body = await handleResponse<{ data: Task }>(response);
  return body.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
  await handleResponse<{ data: Task }>(response);
};

export const getTaskActivityLogs = async (id: string): Promise<ActivityLog[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/logs`);
  const body = await handleResponse<{ data: ActivityLog[] }>(response);
  return body.data;
};

export const improveTaskDescription = async (id: string): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/improve-description`, {
    method: 'POST'
  });
  const body = await handleResponse<{ data: Task }>(response);
  return body.data;
};
