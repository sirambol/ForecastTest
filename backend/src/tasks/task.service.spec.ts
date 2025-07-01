import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '../generated/prisma/client';

describe('TaskService (unit tests)', () => {
  let service: TaskService;
  let prisma: PrismaService;

  const fakeTask: Task = {
    id: 1,
    title: 'Test Task',
    done: false,
    urgency: 2,
  };

  const mockPrisma = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: mockPrisma, 
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return all tasks', async () => {
    mockPrisma.task.findMany.mockResolvedValue([fakeTask]);

    const result = await service.getAll();
    expect(result).toEqual([fakeTask]);
    expect(prisma.task.findMany).toHaveBeenCalled();
  });

  it('should create a new task', async () => {
    mockPrisma.task.create.mockResolvedValue(fakeTask);

    const result = await service.newTask('Test Task', 2);
    expect(result).toEqual(fakeTask);
    expect(prisma.task.create).toHaveBeenCalledWith({
      data: { title: 'Test Task', urgency: 2, done: false },
    });
  });

  it('should mark a task as done', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(fakeTask);
    mockPrisma.task.update.mockResolvedValue({ ...fakeTask, done: true });

    const result = await service.markAsDone(1);
    expect(result!.done).toBe(true);
    expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { done: true },
    });
  });

  it('should return null when marking unknown task as done', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(null);

    const result = await service.markAsDone(999);
    expect(result).toBeNull();
  });

  it('should delete a task', async () => {
    mockPrisma.task.delete.mockResolvedValue(fakeTask);

    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return false if task to delete is not found', async () => {
    mockPrisma.task.delete.mockRejectedValue(new Error('Not found'));

    const result = await service.delete(999);
    expect(result).toBe(false);
  });

  it('should update a task', async () => {
    const updatedTask = { ...fakeTask, title: 'Updated Task' };
    mockPrisma.task.update.mockResolvedValue(updatedTask);

    const result = await service.update(1, { title: 'Updated Task' });
    expect(result).toEqual(updatedTask);
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { title: 'Updated Task' },
    });
  });

  it('should return null if update fails', async () => {
    mockPrisma.task.update.mockRejectedValue(new Error('Update failed'));

    const result = await service.update(1, { title: 'Fail' });
    expect(result).toBeNull();
  });
});
