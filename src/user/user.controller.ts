import { Body, Controller, Get, Logger, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/shared/pipes/validations/validation.pipe';
import { UserDTO } from './models/dtos/user.dto';
import { UserService } from './user.service';

@Controller('')
export class UserController {
  private logger: Logger = new Logger('UserController');

  constructor(private userService: UserService) {}

  @Get('users')
  public finAllUsers() {
    return this.userService.findAllUsers();
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
