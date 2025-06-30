import { Controller, Get } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task } from "./task.interface";

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService){}

    @Get()
    getAllTasks(): Task[]{
        return this.taskService.getAll();
    }
}