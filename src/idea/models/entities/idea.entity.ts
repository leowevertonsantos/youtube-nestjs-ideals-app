import { CommentEntity } from "src/comment/models/enttities/comment.entity";
import { UserEntity } from "src/user/models/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToMany(type => UserEntity, {cascade: true})
    @JoinTable()
    public upvotes: UserEntity[];

    @ManyToMany(type => UserEntity, {cascade: true})
    @JoinTable()
    public downvotes: UserEntity[];
    
    @OneToMany(type => CommentEntity, comment => comment.idea, {cascade: true})
    public comments: CommentEntity[];
}