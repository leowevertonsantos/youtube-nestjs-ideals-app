import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}