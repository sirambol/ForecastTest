import { Controller, Get, Post, Param, Body, Patch, Delete, NotFoundException } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task } from "./task.interface";

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService){}

    @Get()
    getAllTasks(): Task[]{
        return this.taskService.getAll();
    }

    @Get(':id')
    getByID(@Param('id') id: string): Task {
        const task = this.taskService.getByID(+id);
        if (!task) throw new NotFoundException(`Task with id ${id} not found`);
        return task;
    }

    @Post()
        createTask(@Body() body: { title: string; urgency?: number }): Task {
        return this.taskService.newTask(body.title, body.urgency);
    }

    @Post(':id/done')
         markTaskAsDone(@Param('id') id: string): Task {
        const updated = this.taskService.markAsDone(+id);
        if (!updated) {
        throw new NotFoundException(`No task found with id ${id}`);
        }
        return updated;
    }

    @Patch(':id')
    updateTask(@Param('id') id: string, @Body() partialTask: Partial<Task>): Task {
        const updated = this.taskService.update(+id, partialTask);
        if (!updated) throw new NotFoundException(`Task with id ${id} not found`);
        return updated;
    }    

    @Delete(':id')
    delete(@Param('id') id: string): void {
    const success = this.taskService.delete(+id);
    if (!success) {
        throw new NotFoundException(`Task ${id} not found`);
    }
    }

}