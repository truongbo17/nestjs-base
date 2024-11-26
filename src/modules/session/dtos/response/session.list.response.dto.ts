import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseDto } from 'src/common/database/dtos/database.dto';

export class SessionListResponseDto extends DatabaseDto {
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
