import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { IdeaDTO } from './models/dtos/idea.dto';
import { IdeaService } from './idea.service';
import { ValidationPipe } from 'src/shared/pipes/validations/validation.pipe';

@Controller('idea')
export class IdeaController {
  private logger: Logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {}

  @Get()
  public findAll(): Promise<any> {
    return this.ideaService.findAll();
  }
  @Post()
  @UsePipes(ValidationPipe)
  public createIdea(@Body() ideaDTO: IdeaDTO) {
    this.logger.log(`CREATE: ${JSON.stringify(ideaDTO)}`);
    return this.ideaService.create(ideaDTO);
  }

  @Get(':id')
  public findById(@Param('id') id: string): Promise<any> {
    return this.ideaService.findById(id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  public updateIdea(
    @Param('id') id: string,
    @Body() ideaDTO: Partial<IdeaDTO>,
  ) {
    this.logger.log(`UPDATE: ${JSON.stringify(ideaDTO)}`);
    return this.ideaService.updateIdea(id, ideaDTO);
  }

  @Delete(':id')
  public deleteIdea(@Param('id') id: string) {
    return this.ideaService.deleteIdea(id);
  }
}
