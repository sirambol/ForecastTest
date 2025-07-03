import { Injectable } from '@nestjs/common';
import { Task } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(): Promise<Task[]> {
        return this.prisma.task.findMany();
    }

    async getByID(id: number): Promise<Task | null> {
        return this.prisma.task.findUnique({
            where: { id },
        });
    }

    async newTask(title: string, urgency?: number): Promise<Task> {
        return this.prisma.task.create({
            data: {
            title,
            urgency,
            done: false,
            },
        });
    }



    async markAsDone(id: number): Promise<Task | null> {
        const task = await this.getByID(id);
        if (!task) {
            return null;
        }
        return this.prisma.task.update({
            where: { id },
            data: { done: !task.done },
        });
    }


    async delete(id: number): Promise<boolean> {
        try {
            await this.prisma.task.delete({
                where: { id },
            });
            return true; 
        } catch (error) {
            return false;
        }
}


    async update(id: number, partialTask: Partial<Task>): Promise<Task | null> {
        try {
            const updatedTask = await this.prisma.task.update({
                where: { id },
                data: partialTask,
            });
            return updatedTask;
        } catch (error) {
            return null;
        }
    }

    async classifyUrgencyAI(text: string): Promise<number> {
    try {
      const { stdout } = await execFileAsync('python3', ['light_classifier.py', text]);
      return parseInt(stdout.trim(), 10);
    } catch (error) {
      console.error('Erreur lors de la classification IA:', error);
      return 3; 
    }
  }
    async deleteAll(): Promise<void> {
        await this.prisma.task.deleteMany();
    }
}