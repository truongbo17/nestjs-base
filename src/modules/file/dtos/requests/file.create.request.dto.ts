import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ENUM_STORAGE } from '../../../../common/files/enums/file.enum';

export class FileCreateRequestDto {
  @ApiProperty({
    example: faker.string.uuid() + '.png',
    required: true,
    maxLength: 255,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  path: string;

  @ApiProperty({
    example: ENUM_STORAGE.LOCAL,
    required: true,
    maxLength: 10,
    minLength: 1,
  })
  @IsEnum(ENUM_STORAGE)
  @IsString()
  @MaxLength(10)
  storage: string;
}
