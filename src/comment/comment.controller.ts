import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ValidationPipe } from 'src/shared/pipes/validations/validation.pipe';
import { UserReq } from 'src/user/models/user.decoration';
import { CommentService } from './comment.service';
import { CommentDTO } from './models/dtos/comment.dto';
import { CommentEntity } from './models/enttities/comment.entity';

@Controller('api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}


  @Get('idea/:id')
  @UseGuards(AuthGuard)
  public findCommentsByIdea(@Param('id') ideaID: string): Promise<CommentEntity[]>{
    return this.commentService.findByIdea(ideaID);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  public findCommentsByUser(@Param('id') userID: string): Promise<CommentEntity[]>{
    return this.commentService.findCommentsByUser(userID);
  }

  @Get(':id')
  public findById(@Param('id') id: string): Promise<CommentEntity>{
    return this.commentService.findCommentById(id);
  }

  @Post('idea/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  public createComment(@Body() commentDTO: CommentDTO, @Param('id') ideaID: string, @UserReq('id') userID: string): Promise<CommentEntity>{
    return this.commentService.createComment(ideaID, userID, commentDTO);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public deleteComment(@Param('id') id: string, @UserReq('id') userID: string): Promise<any>{
    return this.commentService.deleteComment(id, userID);
  }
  
}
