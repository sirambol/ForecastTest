import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '../prisma/prisma.service'; // 👈
import { AiService } from './ai.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, AiService],
})
export class TaskModule {}