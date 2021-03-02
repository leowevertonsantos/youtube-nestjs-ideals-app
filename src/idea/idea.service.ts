import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/entities/user.entity';
import { Repository } from 'typeorm';
import { IdeaDTO } from './models/dtos/idea.dto';
import { IdeaEntity } from './models/entities/idea.entity';
import { IdeaVO } from './models/vos/idea.vo';

@Injectable()
export class IdeaService {
  
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  public async findAll(userId: string) : Promise<IdeaVO[]>{
    const ideas = await this.ideaRepository.find({where: {author: userId} ,relations: ['author']});
    
    return ideas.map(idea =>{
      return {...idea, author:idea?.author?.toResponseObject()}
    });
  }


  public async create(ideaDTO: Partial<IdeaDTO>, userId: string) : Promise<IdeaVO>{
    const user = await this.userRepository.findOne(userId);
    const idea = await this.ideaRepository.create({...ideaDTO, author: user});
    await this.ideaRepository.save(idea);

    return this.toResponseObject(idea);
  }


  public async findById(id: string, userId: string) : Promise<IdeaVO>{
    let idea: IdeaEntity = await this.ideaRepository.findOne({where: {id: id, author: userId}});
    if (!idea) {
      throw new HttpException('Idea Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(idea);
  }


  public async updateIdea(id: string, ideaDTO: Partial<IdeaDTO>, userId: string) {
    await this.findById(id, userId);

    await this.ideaRepository.update({ id }, ideaDTO);
    return this.ideaRepository.findOne(id);
  }


  public async deleteIdea(id: string, userId: string) {
    await this.findById(id, userId);

    await this.ideaRepository.delete({ id });
    return { deleted: true, message: 'Idea deleted with success.' };
  }

  
  private toResponseObject(idea: IdeaEntity): IdeaVO{
    return {...idea, author:idea?.author?.toResponseObject()};
  }
}
