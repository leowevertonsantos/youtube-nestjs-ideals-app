import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaController } from './idea.controller';
import { IdeaEntity } from './models/entities/idea.entity';
import { IdeaService } from './idea.service';
import { UserEntity } from 'src/user/models/entities/user.entity';
import { IdeaResolver } from './idea.resolver';
import { CommentEntity } from 'src/comment/models/enttities/comment.entity';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaResolver, CommentService],
})
export class IdeaModule {}
