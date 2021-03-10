import { UseGuards } from '@nestjs/common';
import {
  Args,
    Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { registerDecorator } from 'class-validator';
import { CommentService } from 'src/comment/comment.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserDTO } from './models/dtos/user.dto';
import { UserVO } from './models/vos/user.vo';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Query()
  public users(@Args('page') page: number) {
    // console.log('1° Chamei a busca de usuarios');
    return this.userService.findAllUsers(page);
  }

  @Query()
  @UseGuards(AuthGuard)
  public user(@Args('username') username: string){
      return this.userService.findUser(username);
  }


  @Query()
  @UseGuards(AuthGuard)
  public whoiam(@Context('user') userDTO: UserDTO){
      return this.userService.findUser(userDTO.username);
  }


  @Mutation()
  public login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {

    const userDTO: UserDTO = { username, password };
    return this.userService.signin(userDTO);
  }

  @Mutation()
  public register(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {

    const userDTO: UserDTO = { username, password };
    return this.userService.signup(userDTO);
  }

  @ResolveProperty()
  public comments(@Parent() user: UserVO) {
    // console.log('2° Chamei resolver de comentarios', user);
    return this.commentService.findCommentsByUser(user.id);
  }
}
