import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ENUM_AUTH_LOGIN_FROM } from '../../enums/auth.enum';

export class AuthJwtAccessPayloadDto {
  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.date.recent(),
  })
  loginDate: Date;

  @ApiProperty({
    required: true,
    nullable: false,
    enum: ENUM_AUTH_LOGIN_FROM,
  })
  loginFrom: ENUM_AUTH_LOGIN_FROM;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  id: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  session: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  role: string;
}
