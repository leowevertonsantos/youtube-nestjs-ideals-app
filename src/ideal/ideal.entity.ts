import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ideal')
export class IdealEntity {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public ideal: string;

    @Column()
    public description: string;


    @CreateDateColumn({name: 'created_at'})
    public createdAt: Date;
}