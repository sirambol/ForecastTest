import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.interface';

@Injectable()
export class TaskService {
    private taskList:Task[] = [];
    private taskNumber:number = 0;

    getAll():Task[]{
        return this.taskList;
    }

    getByID(id:number){
        const task=this.taskList.find(t => t.id === id);
        if (!task){
            throw new NotFoundException('No task found with number ${id}');
        }
        return task;
    }

    markAsDone(id:number): Task {
        const task=this.getByID(id);
        task.done=!task.done;
        return task;
    }

    delete(id:number): void{
        const index = this.taskList.findIndex(t => t.id === id);
        if (index === -1){
            throw new NotFoundException('Task with ID ${id} not found.');
        }
        this.taskList.splice(index,1);
    }

    newTask(title:string,urgency?:number): Task {
        const newTask: Task = {
            id: this.taskNumber++,
            title,
            done: false,
            urgency
        };
        this.taskList.push(newTask);
        return newTask;
    }





}