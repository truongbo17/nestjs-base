import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../../pagination/enums/pagination.enum';

export class ResponseMetadataDto {
  language: string;
  timestamp: number;
  timezone: string;
  path: string;
  version?: string;
  repoVersion?: string;

  [key: string]: any;
}

export class ResponseDto {
  @ApiProperty({
    name: 'success',
    type: 'boolean',
    required: true,
    nullable: false,
    description: 'status api',
    example: true,
    default: true,
  })
  success: boolean;

  @ApiProperty({
    name: 'statusCode',
    type: 'number',
    required: true,
    nullable: false,
    description: 'return specific status code for every endpoints',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'message',
    required: true,
    nullable: false,
    description: 'Message base on language',
    type: 'string',
    example: 'message endpoint',
  })
  message: string;

  @ApiProperty({
    name: '_metadata',
    required: true,
    nullable: false,
    description: 'Contain metadata about API',
    type: ResponseMetadataDto,
    example: {
      language: 'vi',
      timestamp: 1660190937231,
      timezone: 'Asia/Ho_Chi_Minh',
      path: '/api/v1/test/hello',
      version: '1',
      repoVersion: '1.0.0',
    },
  })
  _metadata: ResponseMetadataDto;

  @ApiHideProperty()
  data?: Record<string, any>;
}

export class ResponsePagingMetadataPaginationRequestDto {
  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.person.fullName(),
  })
  search: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  filters: Record<
    string,
    string | number | boolean | Array<string | number | boolean> | Date
  >;

  @ApiProperty({
    required: true,
    nullable: false,
    example: 1,
  })
  page: number;

  @ApiProperty({
    required: true,
    nullable: false,
    example: 20,
  })
  perPage: number;

  @ApiProperty({
    required: true,
    nullable: false,
    example: 'createdAt',
  })
  orderBy: string;

  @ApiProperty({
    required: true,
    nullable: false,
    enum: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
    example: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
  })
  orderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;

  @ApiProperty({
    required: true,
    nullable: false,
    example: ['name'],
  })
  availableSearch: string[];

  @ApiProperty({
    required: true,
    nullable: false,
    isArray: true,
    example: ['name', 'createdAt'],
  })
  availableOrderBy: string[];

  @ApiProperty({
    required: true,
    nullable: false,
    enum: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
    isArray: true,
    example: Object.values(ENUM_PAGINATION_ORDER_DIRECTION_TYPE),
  })
  availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];

  @ApiProperty({
    required: false,
  })
  total?: number;

  @ApiProperty({
    required: false,
  })
  totalPage?: number;
}
