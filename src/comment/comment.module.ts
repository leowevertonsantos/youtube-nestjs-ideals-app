import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/models/entities/idea.entity';
import { UserEntity } from 'src/user/models/entities/user.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentEntity } from './models/enttities/comment.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([CommentEntity, IdeaEntity, UserEntity]),
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
