import axios from 'axios';
import { Task, TaskInput } from '../types/Task';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// export default api;

export const fetchTasks = () => api.get<Task[]>('/tasks');
export const createTask = (data: TaskInput) => api.post<Task>('/tasks', data);
export const toggleTaskDone = (id: number) => api.patch<Task>(`/tasks/${id}/done`);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
export const classifyUrgencyAI = (title: string) => {
  return api.post<{ urgency: number }>('/tasks/classifyAI', { title });
};
export const deleteAllTasks = () => api.delete('/tasks');