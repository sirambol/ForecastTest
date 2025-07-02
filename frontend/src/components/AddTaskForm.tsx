import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { classifyUrgency } from '../api/tasks';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

interface Props {
  onAdd: (title: string, urgency: number) => void;
}

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAdd(title, urgency);
    setTitle('');
    setUrgency(1);
  };

  const handleClassifyUrgency = async () => {
    try {
      const response = await classifyUrgency(title);
      setUrgency(response.data.urgency);
    } catch (error) {
      console.error("Erreur IA:", error);
    }
    
  };  

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        label="Tâche"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mr: 2 }}
      />
      <TextField
        label="Urgence"
        type="number"
        inputProps={{ min: 1, max: 5 }}
        value={urgency}
        onChange={(e) => setUrgency(Number(e.target.value))}
        sx={{ mr: 2, width: 100 }}
      />

      <Button
        variant="outlined"
        onClick={handleClassifyUrgency}
        sx={{ mr: 2 }}
        disabled={!title.trim()}
        startIcon={<LightbulbOutlinedIcon />}
      >
        Classer
      </Button>

      <Button type="submit" variant="contained">
        Ajouter
      </Button>
    </Box>
  );
}
