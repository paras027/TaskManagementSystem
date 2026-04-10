import mongoose from 'mongoose';
import { ApiError } from '../middlewares/error.middleware';
import { Task, TaskStatus } from '../models/task.model';
import { ActivityLog } from '../models/activity.model';
import { improveDescription } from './ai.service';

const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  TODO: ['IN_PROGRESS'],
  IN_PROGRESS: ['DONE'],
  DONE: []
};

const validateObjectId = (id: string): void => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError('Task not found', 404);
  }
};

export const TaskService = {
  async createTask(title: string, description: string) {
    const task = await Task.create({ title, description });
    return task;
  },

  async getAllTasks() {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return tasks;
  },

  async getTaskById(id: string) {
    validateObjectId(id);
    const task = await Task.findById(id);
    if (!task) {
      throw new ApiError('Task not found', 404);
    }
    return task;
  },

  async updateTaskStatus(id: string, newStatus: TaskStatus) {
    validateObjectId(id);

    const task = await Task.findById(id);
    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    const currentStatus = task.status as TaskStatus;

    if (currentStatus === newStatus) {
      throw new ApiError('Task is already in the requested status', 400);
    }

    const validNextStatuses = allowedTransitions[currentStatus];
    if (!validNextStatuses.includes(newStatus)) {
      throw new ApiError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400
      );
    }

    task.status = newStatus;
    await task.save();

    await ActivityLog.create({
      taskId: task._id,
      previousStatus: currentStatus,
      newStatus
    });

    return task;
  },

  async deleteTask(id: string) {
    validateObjectId(id);

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    return task;
  },

  async getActivityLogs(id: string) {
    validateObjectId(id);

    const taskExists = await Task.exists({ _id: id });
    if (!taskExists) {
      throw new ApiError('Task not found', 404);
    }

    const logs = await ActivityLog.find({ taskId: new mongoose.Types.ObjectId(id) }).sort({
      createdAt: -1
    });
    return logs;
  },

  async improveTaskDescriptionAI(id: string) {
    validateObjectId(id);

    const task = await Task.findById(id);
    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    const improvedDescription = await improveDescription(task.title, task.description);
    task.description = improvedDescription;
    await task.save();

    return task;
  }
};
