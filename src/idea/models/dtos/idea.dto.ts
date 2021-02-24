import { IsString } from 'class-validator';

export class IdeaDTO {
  @IsString()
  public idea: string;

  @IsString()
  public description: string;
}
