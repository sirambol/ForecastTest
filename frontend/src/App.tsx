import { Container, Typography, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { createTask,fetchTasks,toggleTaskDone,deleteTask } from './api/tasks';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import { Task } from './types/Task';


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = async (title: string, urgency: number) => {
    try {
    const response = await createTask({ title, urgency });
    const newTask = response.data;
    setTasks((prev) => [...prev, newTask]);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
  }
};

  const handleToggleTask = async (id: number) => {
    try {
      const response = await toggleTaskDone(id);
      const updatedTask = response.data;
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Erreur lors du changement d’état de la tâche:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetchTasks();
        setTasks(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
      }
    };

    loadTasks();
  }, []);

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
