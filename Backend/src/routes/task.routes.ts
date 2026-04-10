import express from 'express';
import { validate } from '../middlewares/validate.middleware';
import { asyncHandler } from '../middlewares/async-handler';
import { createTaskSchema, updateStatusSchema } from '../validator/task.validator';
import {
  addTask,
  getTasks,
  getSingleTask,
  updateTaskStatus,
  deleteTask,
  getActivityLogs,
  improveTaskDescription
} from '../controllers/task.controllers';

const router = express.Router();

router.post('/tasks', validate(createTaskSchema), asyncHandler(addTask));
router.get('/tasks', asyncHandler(getTasks));
router.get('/tasks/:id', asyncHandler(getSingleTask));
router.patch('/tasks/:id/status', validate(updateStatusSchema), asyncHandler(updateTaskStatus));
router.delete('/tasks/:id', asyncHandler(deleteTask));
router.get('/tasks/:id/logs', asyncHandler(getActivityLogs));
router.post('/tasks/:id/improve-description', asyncHandler(improveTaskDescription));

export default router;