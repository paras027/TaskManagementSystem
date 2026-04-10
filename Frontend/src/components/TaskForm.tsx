import { FormEvent, useState } from 'react';
import { Button, Input, Textarea } from './ui';

interface TaskFormProps {
  onSubmit: (title: string, description: string) => Promise<boolean>;
  loading: boolean;
}

export const TaskForm = ({ onSubmit, loading }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await onSubmit(title, description);
    if (success) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Create New Task</h2>
      <Input
        id="title"
        type="text"
        label="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        required
        disabled={loading}
      />
      <Textarea
        id="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task description (optional)"
        rows={3}
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? '⏳ Creating...' : '✨ Create Task'}
      </Button>
    </form>
  );
};