import { Controller, Get, Post, Param, Body, Patch, Delete, NotFoundException, ParseIntPipe } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task } from '../generated/prisma/client';


@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAll();
  }

  @Get(':id')
  async getByID(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const task = await this.taskService.getByID(id);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  @Post()
  async createTask(@Body() body: { title: string; urgency?: number }): Promise<Task> {
    return this.taskService.newTask(body.title, body.urgency);
  }

  @Post(':id/done')
  async markTaskAsDone(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const updated = await this.taskService.markAsDone(id);
    if (!updated) {
      throw new NotFoundException(`No task found with id ${id}`);
    }
    return updated;
  }

  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialTask: Partial<Task>,
  ): Promise<Task> {
    const updated = await this.taskService.update(id, partialTask);
    if (!updated) throw new NotFoundException(`Task with id ${id} not found`);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const success = await this.taskService.delete(id);
    if (!success) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }
}