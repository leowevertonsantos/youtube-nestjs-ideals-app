import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaDTO } from './dtos/idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}

  public async findAll() {
    return await this.ideaRepository.find();
  }

  public async create(ideaDTO: Partial<IdeaDTO>) {
    const idea = await this.ideaRepository.create(ideaDTO);
    await this.ideaRepository.save(idea);

    return idea;
  }

  public async findById(id: string) {
    return await this.ideaRepository.findOne(id);
  }

  public async updateIdea(id: string, ideaDTO: Partial<IdeaDTO>) {
    await this.ideaRepository.update({ id }, ideaDTO);
    return this.ideaRepository.findOne(id);
  }

  public async deleteIdea(id: string) {
    await this.ideaRepository.delete({ id });
    return { deleted: true, message: 'Idea deleted with success.' };
  }
}
