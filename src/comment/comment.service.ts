import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/models/entities/idea.entity';
import { UserEntity } from 'src/user/models/entities/user.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './models/dtos/comment.dto';
import { CommentEntity } from './models/enttities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,

    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async findByIdea(ideaId: string): Promise<CommentEntity[]> {
    const idea = await this.ideaRepository.findOne(ideaId, {
      relations: ['comments'],
    });

    return idea.comments.map(comment => this.toResponseObject(comment));
  }

  public async findCommentsByUser(userID: string): Promise<CommentEntity[]> {
    const comments = await this.commentRepository.find(
      { where: { author: userID }, relations: ['author', 'idea'] },
      
    );

    return comments.map(comment => this.toResponseObject(comment));
  }

  public async findCommentById(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne(id, {
      relations: ['author', 'idea'],
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(comment);
  }

  public async createComment(
    ideaID: string,
    userId: string,
    commentDTO: CommentDTO,
  ): Promise<CommentEntity> {
    const user = await this.userRepository.findOne(userId);
    const idea = await this.ideaRepository.findOne(ideaID);

    if (!idea) {
      throw new HttpException('Idea not found.', HttpStatus.BAD_GATEWAY);
    }

    const commentEntity = this.commentRepository.create({
      ...commentDTO,
      author: user,
      idea: idea,
    });

    await this.commentRepository.save(commentEntity);
    return this.toResponseObject(commentEntity);
  }

  public async deleteComment(id: string, userId: string) {
    const comment = await this.commentRepository.findOne(id, {
      relations: ['author'],
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
    }

    if (comment.author.id != userId) {
      throw new HttpException(
        'Not access to remove this comment.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.commentRepository.delete({id: comment.id});
    return { deleted: true, message: 'Comment deleted with success.' };
  }


  private toResponseObject(comment: CommentEntity){
    let  responseObject:any = comment;

    if(comment.author){
        responseObject.author = comment.author.toResponseObject();
    }
    return responseObject;
  }
}
