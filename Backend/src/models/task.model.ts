import mongoose from 'mongoose';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO'
  }
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);