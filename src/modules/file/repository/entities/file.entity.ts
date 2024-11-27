import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelational } from '../../../../common/database/relation/entities/relational-entity-helper';

@Entity({ name: 'files' })
export class FileEntity extends EntityRelational {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storage: string;

  @Column()
  path: string;
}
