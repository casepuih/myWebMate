import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class TasksService {
  constructor( 
    @InjectRepository(Task) 
    private readonly tasksRepository: Repository<Task>,
    private readonly membersService: MembersService
  ){}

  async create(createTaskDto: CreateTaskDto) {
    const { member, ...rest } = createTaskDto;
    const task = this.tasksRepository.create(rest);
    // const member = this.membersService.findOne(createTaskDto.member)
    // const task = this.tasksRepository.create({...createTaskDto, member: member})
    if (member) {
      const memberInstance = await this.membersService.findOne(member); 
      task.member = memberInstance;
    }

    return this.tasksRepository.save(task)
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find()
  }

  async findOne(id: number): Promise<Task> {
    return await this.tasksRepository.findOne({ where: {id} })
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  async remove(id: number) {
    const task = await this.tasksRepository.findOne({ where:{id} })
    if(!task){
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    return await this.tasksRepository.remove(task)
  }
}