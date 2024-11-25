import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class DatabaseDto {
  @ApiProperty({
    description: 'ID',
    example: faker.number.int(),
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'Date created at',
    example: faker.date.recent(),
    required: true,
    nullable: false,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date updated at',
    example: faker.date.recent(),
    required: false,
    nullable: true,
  })
  updatedAt: Date | null;

  @ApiHideProperty()
  @Exclude()
  __v?: string;
}