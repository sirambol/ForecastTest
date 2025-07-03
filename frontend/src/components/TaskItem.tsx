import { Checkbox, IconButton, ListItem, ListItemText, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types/Task';

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const getUrgencyColor = (urgency: number) => {
    if (urgency === 1) return 'error';       // rouge
    if (urgency <= 3) return 'warning';      // orange
    return 'success';                        // vert
  };
  
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
        sx={{ opacity: task.done ? 0.6 : 1 }}
      />

      <Chip
        label={`Urgence: ${task.urgency}`}
        color={getUrgencyColor(task.urgency)}
        variant="outlined"
        size="small"
        sx={{ ml: 2 }}
      />
    </ListItem>
  );
}
