import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';
import { Task } from '../generated/prisma/client';

describe('TaskController', () => {
  let controller: TaskController;
  let service: jest.Mocked<TaskService>;

  beforeEach(async () => {
    service = {
      getAll: jest.fn(),
      getByID: jest.fn(),
      newTask: jest.fn(),
      markAsDone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      classifyUrgency: jest.fn().mockReturnValue(3),
    } as unknown as jest.Mocked<TaskService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: service }],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should return all tasks', async () => {
    const tasks: Task[] = [{ id: 1, title: 'Task', done: false, urgency: 1 }];
    service.getAll.mockResolvedValue(tasks);

    const result = await controller.getAllTasks();
    expect(result).toEqual(tasks);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should return task by ID', async () => {
    const task: Task = { id: 1, title: 'Task', done: false, urgency: 1 };
    service.getByID.mockResolvedValue(task);

    const result = await controller.getByID(1);
    expect(result).toEqual(task);
    expect(service.getByID).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if task not found', async () => {
    service.getByID.mockResolvedValue(null);
    await expect(controller.getByID(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a task', async () => {
    const task: Task = { id: 1, title: 'Task', done: false, urgency: 1 };
    service.newTask.mockResolvedValue(task);

    const result = await controller.createTask({ title: 'Task', urgency: 1 });
    expect(result).toEqual(task);
    expect(service.newTask).toHaveBeenCalledWith('Task', 1);
  });

  it('should mark task as done', async () => {
    const task: Task = { id: 1, title: 'Task', done: true, urgency: 1 };
    service.markAsDone.mockResolvedValue(task);

    const result = await controller.markTaskAsDone(1);
    expect(result).toEqual(task);
    expect(service.markAsDone).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if markAsDone fails', async () => {
    service.markAsDone.mockResolvedValue(null);
    await expect(controller.markTaskAsDone(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a task', async () => {
    const updated: Task = { id: 1, title: 'Updated', done: false, urgency: 2 };
    service.update.mockResolvedValue(updated);

    const result = await controller.updateTask(1, { title: 'Updated' });
    expect(result).toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(1, { title: 'Updated' });
  });

  it('should throw NotFoundException if update fails', async () => {
    service.update.mockResolvedValue(null);
    await expect(controller.updateTask(1, { title: 'Nope' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a task', async () => {
    service.delete.mockResolvedValue(true);

    const result = await controller.delete(1);
    expect(result).toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if delete fails', async () => {
    service.delete.mockResolvedValue(false);
    await expect(controller.delete(42)).rejects.toThrow(NotFoundException);
  });

  it('devrait retourner un objet avec une urgence', () => {
    const result = controller.classifyUrgency('Faire une démo');
    expect(result).toEqual({ urgency: 3 });
    expect(service.classifyUrgency).toHaveBeenCalledWith('Faire une démo');
  });
});
