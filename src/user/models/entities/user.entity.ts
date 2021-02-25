import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserVO } from '../vos/user.vo';

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

  @BeforeInsert()
  public async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = false) {
    if (showToken) {
      return new UserVO(this.id, this.username, this.created, this.token);
    }
    return new UserVO(this.id, this.username, this.created);
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
