import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginResponseDto {
  @ApiProperty({
    example: 'Bearer',
    required: true,
    nullable: false,
  })
  tokenType: string;

  @ApiProperty({
    example: 3600,
    description: 'timestamp in minutes',
    required: true,
    nullable: false,
  })
  expiresIn: number;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  accessToken: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  refreshToken: string;
}
