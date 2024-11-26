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
import { ENUM_USER_GENDER, ENUM_USER_STATUS } from '../../enums/user.enum';

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
  status: ENUM_USER_STATUS;

  @Column({ type: String, nullable: false })
  gender: ENUM_USER_GENDER;

  @Column({ type: Number, nullable: false })
  avatar: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
