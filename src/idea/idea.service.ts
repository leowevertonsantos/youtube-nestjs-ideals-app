import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/entities/user.entity';
import { UserVO } from 'src/user/models/vos/user.vo';
import { Repository } from 'typeorm';
import { IdeaDTO } from './models/dtos/idea.dto';
import { IdeaEntity } from './models/entities/idea.entity';
import { VoteTypeEnum } from './models/enums/vote_type.enum';
import { IdeaVO } from './models/vos/idea.vo';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}



  public async findAllByUser(userId: string): Promise<IdeaVO[]> {
    const ideas = await this.ideaRepository.find({
      where: { author: userId },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });

    return ideas.map((idea) => {
      return this.toResponseObject(idea);
    });
  }

  public async findAll(page:number = 1, newest?: boolean): Promise<IdeaVO[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
      take: 25,
      skip: 25* (page - 1),
      order: newest && { createdAt: 'DESC' }

    });

    return ideas.map((idea) => {
      return this.toResponseObject(idea);
    });
  }



  public async create(
    ideaDTO: Partial<IdeaDTO>,
    userId: string,
  ): Promise<IdeaVO> {
    const user = await this.userRepository.findOne(userId);
    const idea = await this.ideaRepository.create({ ...ideaDTO, author: user });
    await this.ideaRepository.save(idea);

    return this.toResponseObject(idea);
  }



  public async findById(id: string, userId: string): Promise<IdeaVO> {
    let idea: IdeaEntity = await this.ideaRepository.findOne({
      where: { id: id, author: userId },
      relations: ['author', 'upvotes', 'downvotes', 'comments']
    });
    if (!idea) {
      throw new HttpException('Idea Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(idea);
  }



  public async updateIdea(
    id: string,
    ideaDTO: Partial<IdeaDTO>,
    userId: string,
  ) {
    await this.findById(id, userId);

    await this.ideaRepository.update({ id }, ideaDTO);
    return this.ideaRepository.findOne(id);
  }



  public async deleteIdea(id: string, userId: string) {
    await this.findById(id, userId);

    await this.ideaRepository.delete({ id });
    return { deleted: true, message: 'Idea deleted with success.' };
  }



  private toResponseObject(ideaToResponse: IdeaEntity): IdeaVO {
    let {
      id,
      author,
      createdAt,
      description,
      updatedAt,
      idea,
      comments
    } = ideaToResponse;

    let response: IdeaVO = {
      id,
      description,
      createdAt,
      updatedAt,
      idea,
      comments,
      author: author?.toResponseObject(),
    };

    response.upvotes = ideaToResponse?.upvotes?.length
      ? ideaToResponse.upvotes.length
      : 0;
    response.downvotes = ideaToResponse?.downvotes?.length || 0;

    return response;
  }



  public async bookmark(ideaId: string, userId: string): Promise<IdeaVO> {
    const idea = await this.ideaRepository.findOne(ideaId);
    const user = await this.userRepository.findOne(userId, {
      relations: ['booksmarks'],
    });

    if (!user.booksmarks.find((bookmark) => bookmark.id == ideaId)) {
      user.booksmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Idea Already bookmark.', HttpStatus.CONFLICT);
    }
    return this.toResponseObject(idea);
  }



  public async unbookmark(ideaId: string, userId: string): Promise<IdeaVO> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['booksmarks'],
    });

    let ideaFinded = user.booksmarks.find((bookmark) => bookmark.id == ideaId);

    if (ideaFinded) {
      user.booksmarks = user.booksmarks.filter(
        (bookmark) => bookmark.id != ideaFinded.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Idea not found bookmark.', HttpStatus.CONFLICT);
    }
    return this.toResponseObject(ideaFinded);
  }



  public async voteIdea(id: string, userId: string, voteType: VoteTypeEnum) {
    const idea = await this.ideaRepository.findOne(id, {
      relations: ['author', 'upvotes', 'downvotes'],
    });

    if (!idea) {
      throw new HttpException('Idea not exist', HttpStatus.NOT_FOUND);
    }

    return voteType === VoteTypeEnum.UP_VOTE ? this.upvote(idea, userId) :  this.downvote(idea, userId);
  }



  private async upvote(ideaEntity: IdeaEntity, userId: string) {
    ideaEntity.downvotes = ideaEntity.downvotes.filter((userVote) => userVote.id != userId);

    const userUpVoted = ideaEntity.upvotes.find(
      (userVote) => userVote.id == userId,
    );

    if (userUpVoted) {
      ideaEntity.upvotes = ideaEntity.upvotes.filter((userVote) => userVote.id != userId);

    } else {

      const user = await this.userRepository.findOne(userId);
      ideaEntity.upvotes.push(user);
    }
    await this.ideaRepository.save(ideaEntity);
    return this.toResponseObject(ideaEntity);
  }



  private async downvote(ideaEntity: IdeaEntity, userId: string) {
    ideaEntity.upvotes = ideaEntity.upvotes.filter((userVote) => userVote.id != userId);

    const userDownVoted = ideaEntity.downvotes.find(
      (userVote) => userVote.id == userId,
    );

    if (userDownVoted) {
      ideaEntity.downvotes = ideaEntity.downvotes.filter((userVote) => userVote.id != userId);

    } else {
      const user = await this.userRepository.findOne(userId);
      ideaEntity.downvotes.push(user);
    }

    await this.ideaRepository.save(ideaEntity);
    return this.toResponseObject(ideaEntity);
  }
}
