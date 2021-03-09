import { IdeaEntity } from "src/idea/models/entities/idea.entity";
import { UserEntity } from "src/user/models/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comment')
export class CommentEntity {

    @PrimaryGeneratedColumn('uuid')
    public id: string;
    
    @CreateDateColumn({name:'created_at'})
    public createdAt: Date;

    @UpdateDateColumn({name:'updated_at'})
    public updatedAt: Date;

    @Column()
    public comment: string;

    @ManyToOne(type => UserEntity)
    public author: UserEntity;

    @ManyToOne(type => IdeaEntity, idea => idea.comments)
    public idea: IdeaEntity;

}