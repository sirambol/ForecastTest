import { Container, Typography, Paper } from '@mui/material';
import { useState } from 'react';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import { Task } from './types/Task';

let idCounter = 1; // temporaire

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (title: string, urgency: number) => {
    const newTask: Task = {
      id: idCounter++,
      title,
      urgency,
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>
        Todo List
      </Typography>
      <Paper sx={{ p: 2 }}>
        <AddTaskForm onAdd={handleAddTask} />
        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </Paper>
    </Container>
  );
}

export default App;
