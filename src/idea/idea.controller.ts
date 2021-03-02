import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { IdeaDTO } from './models/dtos/idea.dto';
import { IdeaService } from './idea.service';
import { ValidationPipe } from 'src/shared/pipes/validations/validation.pipe';
import { UserReq } from 'src/user/models/user.decoration';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('api/idea')
export class IdeaController {
  private logger: Logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {}

  @Get()
  @UseGuards(AuthGuard)
  public findAll(@UserReq() userId: string): Promise<any> {
    return this.ideaService.findAll(userId);
  }
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  public createIdea(@Body() ideaDTO: IdeaDTO, @UserReq('id') userId: string) {
    this.logger.log(`CREATE: ${JSON.stringify(ideaDTO)}`);
    this.logData({
      body: ideaDTO,
      userId: userId,
    });
    return this.ideaService.create(ideaDTO, userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  public findById(
    @Param('id') id: string,
    @UserReq('id') userId: string,
  ): Promise<any> {
    return this.ideaService.findById(id, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  public updateIdea(
    @Param('id') id: string,
    @Body() ideaDTO: Partial<IdeaDTO>,
    @UserReq('id') userId: string,
  ) {
    this.logger.log(`UPDATE: ${JSON.stringify(ideaDTO)}`);
    return this.ideaService.updateIdea(id, ideaDTO, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public deleteIdea(@Param('id') id: string, @UserReq('id') userId: string) {
    return this.ideaService.deleteIdea(id, userId);
  }

  private logData(options: any) {
    options.userId &&
      this.logger.log(`USER ID: ${JSON.stringify(options.userId)}`);

    options.body && this.logger.log(`BODY: ${JSON.stringify(options.body)}`);
    options.id && this.logger.log(`IDEA: ${JSON.stringify(options.id)}`);
  }
}
