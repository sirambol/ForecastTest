import { TaskService } from './task.service';
import { Task } from './task.interface';

describe('TodoService', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
  });

  it('should create a todo', () => {
    const task = service.newTask('Test task');
    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Test task');
    expect(task.done).toBe(false);
  });

  it('should return all tasks', () => {
    service.newTask('Task 1');
    service.newTask('Task 2');
    const tasks = service.getAll();
    expect(tasks.length).toBe(2);
  });

  it('should change done status', () => {
    const task = service.newTask('Mark as done test');
    const updated = service.markAsDone(task.id);
    expect(updated.done).toBe(true);
    const again = service.markAsDone(task.id);
    expect(again.done).toBe(false);
  });

  it('should delete a task', () => {
    const task = service.newTask('To delete');
    service.delete(task.id);
    expect(service.getAll().length).toBe(0);
  });

  it('should throw if todo not found', () => {
    expect(() => service.getByID(999)).toThrow();
    expect(() => service.markAsDone(999)).toThrow();
    expect(() => service.delete(999)).toThrow();
  });
});
