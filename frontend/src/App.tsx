import { Container, Typography, Paper, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { createTask,fetchTasks,toggleTaskDone,deleteTask,deleteAllTasks } from './api/tasks';
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

  const handleDeleteAllTasks = async () => {
    if (window.confirm('Supprimer toutes les tâches ?')) {
      try {
        await deleteAllTasks();
        setTasks([]);
      } catch (error) {
        console.error('Erreur lors de la suppression de toutes les tâches:', error);
      }
    }
  };

  const handleDeleteDoneTasks = async () => {
    if (window.confirm('Supprimer uniquement les tâches terminées ?')) {
      try {
        const doneTaskIds = tasks.filter((task) => task.done).map((task) => task.id);
        await Promise.all(doneTaskIds.map(deleteTask)); // appel en parallèle
        setTasks((prev) => prev.filter((task) => !task.done));
      } catch (error) {
        console.error('Erreur lors de la suppression des tâches terminées :', error);
      }
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

                <Button
          variant="contained"
          color="error"
          onClick={handleDeleteAllTasks}
          sx={{ my: 2 }}
          fullWidth
        >
          Supprimer toutes les tâches
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteDoneTasks}
          sx={{ mb: 2 }}
          fullWidth
        >
          Supprimer les tâches terminées
        </Button>
      </Paper>
    </Container>
  );
}

export default App;
