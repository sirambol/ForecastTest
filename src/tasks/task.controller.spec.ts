import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';
import { Task } from './task.interface';

describe('TaskController', () => {
  let controller: TaskController;
  let service: {
  getAll: jest.Mock;
  delete: jest.Mock;
};


  beforeEach(async () => {
    service = {
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: service }],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should return all tasks', () => {
    const tasks: Task[] = [{ id: 1, title: 'Test task', done: false }];
    service.getAll.mockReturnValue(tasks);
    expect(controller.getAllTasks()).toEqual(tasks);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should delete a task successfully', () => {
    service.delete.mockReturnValue(true);
    expect(controller.delete('1')).toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if task to delete does not exist', () => {
    service.delete.mockReturnValue(false);
    expect(() => controller.delete('42')).toThrow(NotFoundException);
    expect(service.delete).toHaveBeenCalledWith(42);
  });


});
