import { UserEntity } from "src/user/models/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('idea')
export class IdeaEntity {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public idea: string;

    @Column()
    public description: string;


    @CreateDateColumn({name: 'created_at'})
    public createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    public updatedAt: Date;

    @ManyToOne(type => UserEntity, author => author.id)
    public author: UserEntity;
}