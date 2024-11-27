import { DatabaseDto } from '../../../../common/database/dtos/database.dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Exclude } from 'class-transformer';
import { ENUM_USER_GENDER, ENUM_USER_STATUS } from '../../enums/user.enum';
import { FileCreateResponseDto } from '../../../file/dtos/responses/file.create.response.dto';

export class UserCreateResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    nullable: false,
    maxLength: 255,
    minLength: 1,
  })
  name: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.internet.email(),
    maxLength: 100,
  })
  email: string;

  @ApiHideProperty()
  @Exclude()
  password?: string | null;

  @ApiProperty({
    required: true,
    nullable: false,
    example: ENUM_USER_STATUS.ACTIVE,
    enum: ENUM_USER_STATUS,
  })
  status: ENUM_USER_STATUS;

  @ApiProperty({
    example: ENUM_USER_GENDER.MALE,
    enum: ENUM_USER_GENDER,
    required: false,
    nullable: true,
  })
  gender?: ENUM_USER_GENDER;

  @ApiProperty({
    nullable: true,
    type: FileCreateResponseDto,
    description: 'Avatar of the user',
  })
  avatar?: FileCreateResponseDto;
}
