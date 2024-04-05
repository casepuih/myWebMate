import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { MembersService } from 'src/modules/members/members.service';
import { MembersModule } from 'src/modules/members/members.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), MembersModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TypeOrmModule]
})
export class TasksModule {}
