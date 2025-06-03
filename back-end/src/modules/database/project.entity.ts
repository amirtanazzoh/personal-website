import
{
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Files } from "./file.entity";

@Entity()
export class Project
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    content: string;

    @ManyToMany( () => Files, ( file ) => file.projects )
    @JoinTable()
    attachments: Files[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}