import { TaskStatus } from '../types';
import { Button } from './ui';

interface FilterButtonsProps {
  selectedFilter: TaskStatus | 'ALL';
  onFilterChange: (filter: TaskStatus | 'ALL') => void;
}

const filters: Array<{ key: TaskStatus | 'ALL'; label: string; icon: string }> = [
  { key: 'ALL', label: 'All', icon: '📋' },
  { key: 'TODO', label: 'To Do', icon: '⏳' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: '⚡' },
  { key: 'DONE', label: 'Done', icon: '✅' }
];

export const FilterButtons = ({ selectedFilter, onFilterChange }: FilterButtonsProps) => {
  return (
    <div className="filter-buttons">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          variant="secondary"
          className={selectedFilter === filter.key ? 'active' : ''}
        >
          {filter.icon} {filter.label}
        </Button>
      ))}
    </div>
  );
};