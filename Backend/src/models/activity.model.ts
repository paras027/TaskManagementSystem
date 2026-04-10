import mongoose from 'mongoose';

export type StatusTransition = 'TODO' | 'IN_PROGRESS' | 'DONE';

const activitySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  previousStatus: { type: String, required: true },
  newStatus: { type: String, required: true },
  changedAt: { type: Date, required: true, default: () => new Date() }
}, { timestamps: true });

export const ActivityLog = mongoose.model('ActivityLog', activitySchema);