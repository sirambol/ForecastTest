import { Checkbox, IconButton, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types/Task';

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" onClick={() => onDelete(task.id)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <Checkbox checked={task.done} onChange={() => onToggle(task.id)} />
      <ListItemText
        primary={task.title}
        secondary={`Urgence : ${task.urgency}`}
        sx={{ textDecoration: task.done ? 'line-through' : 'none' }}
      />
    </ListItem>
  );
}
