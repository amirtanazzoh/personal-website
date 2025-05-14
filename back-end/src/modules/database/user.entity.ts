import { EUserRole } from "src/types/enums";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column( { unique: true } )
    username: string;

    @Column()
    password: string;

    @Column( { unique: true } )
    email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column( { unique: true } )
    phone_number: string;

    @Column( { enum: EUserRole, default: EUserRole.User } )
    role: EUserRole;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}