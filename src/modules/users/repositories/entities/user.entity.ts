import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelational } from '../../../../common/database/relation/entities/relational-entity-helper';

@Entity({
  name: 'users',
})
export class UserEntity extends EntityRelational {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true, nullable: false })
  email: string;

  @Column({ type: String, nullable: true })
  password?: string | null;

  @Index()
  @Column({ type: String, nullable: false })
  name: string;

  @Column({ type: String, nullable: false })
  status: string;

  @Column({ type: String, nullable: false })
  gender: string;

  @Column({ type: String, nullable: false })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
