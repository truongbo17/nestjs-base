import {
  IDocDefaultOptions,
  IDocOptions,
  IDocResponseOptions,
} from '../interfaces/doc.interface';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../../response/dtos/response.dto';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_MESSAGE_LANGUAGE } from '../../i18n/enums/i18n.enum';

export default function DocDefault<T>(
  options: IDocDefaultOptions<T>
): MethodDecorator {
  const docs: any[] = [];
  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(ResponseDto) }],
    properties: {
      success: {
        example: options.success ?? false,
        type: 'boolean',
      },
      message: {
        example: options.messagePath,
        type: 'string',
      },
      statusCode: {
        type: 'number',
        example: options.statusCode,
      },
      data: {
        example: options.data ?? {},
        type: 'object',
      },
    },
  };

  if (options.dto) {
    docs.push(ApiExtraModels(options.dto as any));
    schema.properties = {
      ...schema.properties,
      data: { $ref: getSchemaPath(options.dto as any) },
    };
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: options.httpStatus.toString(),
      status: options.httpStatus,
      schema,
    }),
    ...docs
  );
}

export function Doc(options?: IDocOptions): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: options?.summary,
      deprecated: options?.deprecated,
      description: options?.description,
      operationId: options?.operation,
    }),
    ApiHeaders([
      {
        name: 'x-custom-lang',
        description: 'Custom language header',
        required: false,
        schema: {
          default: ENUM_MESSAGE_LANGUAGE.EN,
          example: ENUM_MESSAGE_LANGUAGE.EN,
          type: 'string',
        },
      },
    ]),
    DocDefault({
      data: {},
      success: false,
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
      messagePath: 'http.serverError.serviceUnavailable',
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    }),
    DocDefault({
      data: {},
      success: false,
      httpStatus: HttpStatus.REQUEST_TIMEOUT,
      messagePath: 'http.serverError.requestTimeout',
      statusCode: HttpStatus.REQUEST_TIMEOUT,
    })
  );
}

export function DocResponse<T = void>(
  messagePath: string,
  options?: IDocResponseOptions
): MethodDecorator {
  const docs: IDocDefaultOptions = {
    data: options?.data ?? {},
    success: options?.success ?? false,
    httpStatus: options?.httpStatus ?? HttpStatus.OK,
    messagePath,
    statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK,
  };

  if (options?.dto) {
    docs.dto = options?.dto;
  }

  return applyDecorators(ApiProduces('application/json'), DocDefault(docs));
}
