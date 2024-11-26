import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class SessionWorkerDto {
  @ApiProperty({
    required: true,
    example: faker.number.int(),
  })
  @IsNumber()
  @IsNotEmpty()
  session: number;
}
