import { NextFunction, Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { TaskStatus } from '../models/task.model';

export const addTask = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body as { title: string; description: string };
  const task = await TaskService.createTask(title, description);

  return res.status(201).json({
    success: true,
    message: 'Task added successfully',
    data: task
  });
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  const tasks = await TaskService.getAllTasks();
  return res.status(200).json({
    success: true,
    message: 'Tasks retrieved successfully',
    data: tasks
  });
};

export const getSingleTask = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as { id: string };
  const task = await TaskService.getTaskById(id);

  return res.status(200).json({
    success: true,
    message: 'Task retrieved successfully',
    data: task
  });
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as { id: string };
  const { newStatus } = req.body as { newStatus: TaskStatus };

  const task = await TaskService.updateTaskStatus(id, newStatus);

  return res.status(200).json({
    success: true,
    message: 'Task status updated successfully',
    data: task
  });
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as { id: string };
  const task = await TaskService.deleteTask(id);

  return res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: task
  });
};

export const getActivityLogs = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as { id: string };
  const logs = await TaskService.getActivityLogs(id);

  return res.status(200).json({
    success: true,
    message: 'Activity logs retrieved successfully',
    data: logs
  });
};

export const improveTaskDescription = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as { id: string };
  const task = await TaskService.improveTaskDescriptionAI(id);

  return res.status(200).json({
    success: true,
    message: 'Task description improved successfully',
    data: task
  });
};