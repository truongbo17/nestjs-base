import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  ENUM_USER_GENDER,
  ENUM_USER_STATUS,
} from '../../modules/users/enums/user.enum';

export class CreateTableUsers1732011345467 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: Object.values(ENUM_USER_GENDER),
            default: ENUM_USER_GENDER.MALE,
            isNullable: false,
          },
          {
            name: 'avatar',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(ENUM_USER_STATUS),
            default: ENUM_USER_STATUS.ACTIVE,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: null,
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: true,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
