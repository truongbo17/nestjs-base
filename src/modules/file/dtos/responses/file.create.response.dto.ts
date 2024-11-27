import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ENUM_STORAGE } from '../../../../common/files/enums/file.enum';
import { DatabaseDto } from '../../../../common/database/dtos/database.dto';

export class FileCreateResponseDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid() + '.png',
    required: false,
    nullable: true,
  })
  path: string;

  @ApiProperty({
    example: ENUM_STORAGE.LOCAL,
    required: true,
    maxLength: 10,
    minLength: 1,
  })
  storage: string;
}
