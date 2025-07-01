import { Injectable } from '@nestjs/common';
import { Task } from './task.interface';

@Injectable()
export class TaskService {
    private taskList:Task[] = [];
    private taskNumber:number = 0;

    getAll():Task[]{
        return this.taskList;
    }

    getByID(id:number): Task | undefined {
        return this.taskList.find(t => t.id === id);
}



    markAsDone(id:number): Task | null {
        const task = this.getByID(id);
        if (!task) return null;
        task.done = !task.done;
        return task;
}


    delete(id:number): boolean{
        const index = this.taskList.findIndex(t => t.id === id);
        if (index === -1){
            return false;
        }
        this.taskList.splice(index,1);
        return true;
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

    update(id: number, partialTask: Partial<Task>): Task | null {
        const task = this.getByID(id);
        if (!task) return null;
        Object.assign(task, partialTask);
        return task;
    }

}