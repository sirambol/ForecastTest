import { List } from '@mui/material';
import { Task } from '../types/Task';
import TaskItem from './TaskItem';

interface Props {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: Props) {
  return (
    <List>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
