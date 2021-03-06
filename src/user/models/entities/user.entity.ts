import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserVO } from '../vos/user.vo';
import { IdeaEntity } from 'src/idea/models/entities/idea.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  public username: string;

  @Column('text')
  public password: string;

  @OneToMany(type => IdeaEntity, idea => idea.author)
  public ideas: IdeaEntity[];

  @ManyToMany(type => IdeaEntity, {cascade: true})
  @JoinTable()
  public booksmarks: IdeaEntity[];

  @BeforeInsert()
  public async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = false) {
    let user: UserVO  = new UserVO(this.id, this.username, this.created);

    if (showToken) {
      user.token = this.token;
    }

    if (this.ideas) {
      user.ideas = this.ideas;
    }

    if(this.booksmarks){
      user.booksmarks = this.booksmarks;
    }
    return  user;
  }

  async comparePassword(attemptPassword): Promise<boolean> {
    return await bcrypt.compare(attemptPassword, this.password);
  }

  private get token() {
    return jwt.sign(
      { id: this.id, username: this.username },
      process.env.SECRET,
      { expiresIn: '24h' },
    );
  }
}
