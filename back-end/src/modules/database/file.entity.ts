import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "./project.entity";

@Entity( 'files' )
export class Files
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    type: string;

    @Column()
    size: number;

    @ManyToMany( () => Project, ( project ) => project.attachments )
    projects: Project[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}