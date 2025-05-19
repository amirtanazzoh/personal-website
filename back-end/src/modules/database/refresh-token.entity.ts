import
{
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity( 'refresh_tokens' )
export class RefreshToken
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  token: string;

  @Column( { type: 'timestamp' } )
  expires_at: Date;

  @ManyToOne( () => User, ( user ) => user.refreshTokens, { onDelete: 'CASCADE' } )
  user: User;

  @Column( { default: false } )
  revoked: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
