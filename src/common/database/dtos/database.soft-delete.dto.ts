import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DatabaseSoftDeleteDto {
  @ApiProperty({
    description: 'Date delete at',
    required: false,
    nullable: true,
  })
  deletedAt?: Date;
}
