import { Body, Controller, Get, Logger, ParseIntPipe, Post, Query, Req, Request, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ValidationPipe } from 'src/shared/pipes/validations/validation.pipe';
import { UserDTO } from './models/dtos/user.dto';
import { UserReq } from './models/user.decoration';
import { UserService } from './user.service';

@Controller('')
export class UserController {
  private logger: Logger = new Logger('UserController');

  constructor(private userService: UserService) {}

  @Get('users')
  public finAllUsers(@Query('page', ParseIntPipe) page: number) {
    return this.userService.findAllUsers(page);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  public signin(@Body() userDTO: UserDTO): Promise<any> {
    return this.userService.signin(userDTO);
  }
  @Post('register')
  @UsePipes(ValidationPipe)
  public signup(@Body() userDTO: UserDTO) {
    this.logger.log(`CREATE: ${JSON.stringify(userDTO)}`);
    return this.userService.signup(userDTO);
  }
}
