import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IdeaDTO } from './models/dtos/idea.dto';
import { IdeaService } from './idea.service';

@Controller('idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  @Get()
  public findAll(): Promise<any> {
    return this.ideaService.findAll();
  }
  @Post()
  public createIdea(@Body() ideaDTO: IdeaDTO) {
    return this.ideaService.create(ideaDTO);
  }

  @Get(':id')
  public findById(@Param('id') id: string): Promise<any> {
    return this.ideaService.findById(id);
  }

  @Put(':id')
  public updateIdea(
    @Param('id') id: string,
    @Body() ideaDTO: Partial<IdeaDTO>,
  ) {
    return this.ideaService.updateIdea(id, ideaDTO);
  }

  @Delete(':id')
  public deleteIdea(@Param('id') id: string) {
    return this.ideaService.deleteIdea(id);
  }
}
