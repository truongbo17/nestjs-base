import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class SessionCreateRequestDto {
  @ApiProperty({
    type: Number,
    required: true,
    example: faker.number.int({ min: 10, max: 100 }),
  })
  user_id: number;

  @ApiProperty({
    type: String,
    required: true,
    example: faker.string.ulid(),
  })
  hash: string;
}
