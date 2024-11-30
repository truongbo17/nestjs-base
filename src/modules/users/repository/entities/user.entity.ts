import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelational } from '../../../../common/database/relation/entities/relational-entity-helper';
import { ENUM_USER_GENDER, ENUM_USER_STATUS } from '../../enums/user.enum';
import { FileEntity } from '../../../file/repository/entities/file.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity({
  name: 'users',
})
@ObjectType()
export class UserEntity extends EntityRelational {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: String, unique: true, nullable: false })
  email: string;

  @Column({ type: String, nullable: true })
  password?: string | null;

  @Index()
  @Field()
  @Column({ type: String, nullable: false })
  name: string;

  @Field()
  @Column({ type: String, nullable: false })
  status: ENUM_USER_STATUS;

  @Field()
  @Column({ type: String, nullable: false })
  gender: ENUM_USER_GENDER;

  @OneToOne(() => FileEntity, { cascade: true, eager: true })
  @JoinColumn({ name: 'avatar' })
  avatar: FileEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
