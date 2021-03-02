import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaController } from './idea.controller';
import { IdeaEntity } from './models/entities/idea.entity';
import { IdeaService } from './idea.service';
import { UserEntity } from 'src/user/models/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}
