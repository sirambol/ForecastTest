import { Injectable } from '@nestjs/common';
import { Task } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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

    classifyUrgency(title: string): { urgency: number } {
        const lower = title.toLowerCase();
        if (lower.includes('emissia')) return {urgency : 1};
        if (lower.includes('urgent') || lower.includes('payer') || lower.includes('impôts')) return {urgency : 1};
        if (lower.includes('rendez-vous') || lower.includes('rdv') || lower.includes('réunion')) return {urgency : 2};
        if (lower.includes('préparer') || lower.includes('envoyer') || lower.includes('réviser')) return {urgency : 3};
        if (lower.includes('lire') || lower.includes('écrire') || lower.includes('organiser')) return {urgency : 4};
        return {urgency : 5}; 
    }
}