import { Module } from '@nestjs/common';
import { TaskController } from './tasks/task.controller';
import { TaskService } from './tasks/task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
})
export class AppModule {}
