import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ENUM_USER_GENDER } from '../../enums/user.enum';
import { IsPassword } from '../../../../common/request/validations/request.is-password.validation';

export class UserCreateRequestDto {
  @ApiProperty({
    example: faker.person.fullName(),
    required: true,
    maxLength: 255,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: faker.internet.email(),
    required: true,
    maxLength: 255,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    required: true,
    maxLength: 50,
    minLength: 6,
  })
  @IsNotEmpty()
  @IsPassword()
  @MaxLength(50)
  @MinLength(6)
  password: string;

  @ApiProperty({
    required: true,
    enum: ENUM_USER_GENDER,
    example: ENUM_USER_GENDER.MALE,
  })
  @IsString()
  @IsEnum(ENUM_USER_GENDER)
  @IsNotEmpty()
  gender: ENUM_USER_GENDER;
}
