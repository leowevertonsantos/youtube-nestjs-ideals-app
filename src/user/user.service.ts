import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './models/dtos/user.dto';
import { UserEntity } from './models/entities/user.entity';
import * as bcript from 'bcryptjs';
import { UserVO } from './models/vos/user.vo';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) public userRepository: Repository<UserEntity>,
  ) {}

  public async findAllUsers(): Promise<UserVO[]> {
    const users = await this.userRepository.find({relations: ['ideas', 'booksmarks']});
    return users.map((user) => user.toResponseObject());
  }

  public async signin(userDTO: UserDTO): Promise<UserVO> {
    const user = await this.userRepository.findOne({
      where: { username: userDTO.username },
    });

    if (!user || !(await user.comparePassword(userDTO.password))) {
      throw new HttpException('Usuário/Senha inválido', HttpStatus.UNAUTHORIZED);
    }

    return user.toResponseObject(true);
  }


  public async signup(userDTO: UserDTO): Promise<UserVO>{
    const user = await this.userRepository.findOne({username: userDTO.username});
    if(user){
        throw new HttpException(`Already exists user with username: ${userDTO.username}`, HttpStatus.CONFLICT);
    }
    
    const userToInsert = this.userRepository.create(userDTO);
    await this.userRepository.save(userToInsert);

    return userToInsert.toResponseObject(true);
  }
  
}
