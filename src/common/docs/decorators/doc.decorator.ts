import {
  IDocAuthOptions,
  IDocDefaultOptions,
  IDocOfOptions,
  IDocOptions,
  IDocRequestFileOptions,
  IDocRequestOptions,
  IDocResponseFileOptions,
  IDocResponseOptions,
} from '../interfaces/doc.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../../response/dtos/response.dto';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_MESSAGE_LANGUAGE } from '../../i18n/enums/i18n.enum';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../enums/doc.enum';
import { APP_STATUS_CODE_ERROR } from '../../../core/app/enums/app.enum';
import { ENUM_AUTH_STATUS_CODE_ERROR } from '../../../core/auth/enums/auth.status-code.enum';
import { ENUM_FILE_MIME } from '../../files/enums/file.enum';

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

export function DocRequest(options?: IDocRequestOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA) {
    docs.push(ApiConsumes('multipart/form-data'));
  } else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.TEXT) {
    docs.push(ApiConsumes('text/plain'));
  } else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.JSON) {
    docs.push(ApiConsumes('application/json'));
  }

  if (options?.bodyType) {
    docs.push(
      DocDefault({
        data: {},
        success: false,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        statusCode: APP_STATUS_CODE_ERROR.APP_VALIDATION,
        messagePath: 'request.validation',
      })
    );
  }

  if (options?.params) {
    const params: MethodDecorator[] = options?.params?.map(param =>
      ApiParam(param)
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options?.queries?.map(query =>
      ApiQuery(query)
    );
    docs.push(...queries);
  }

  if (options?.dto) {
    docs.push(ApiBody({ type: options?.dto }));
  }

  return applyDecorators(...docs);
}

export function DocAuth(options?: IDocAuthOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];
  const oneOfUnauthorized: IDocOfOptions[] = [];

  if (options?.jwtRefreshToken) {
    docs.push(ApiBearerAuth('refreshToken'));
    oneOfUnauthorized.push({
      data: {},
      success: false,
      messagePath: 'auth.error.refreshTokenUnauthorized',
      statusCode: ENUM_AUTH_STATUS_CODE_ERROR.JWT_REFRESH_TOKEN,
    });
  }

  if (options?.jwtAccessToken) {
    docs.push(ApiBearerAuth('accessToken'));
    oneOfUnauthorized.push({
      data: {},
      success: false,
      messagePath: 'auth.error.accessTokenUnauthorized',
      statusCode: ENUM_AUTH_STATUS_CODE_ERROR.JWT_ACCESS_TOKEN,
    });
  }

  if (options?.google) {
    docs.push(ApiBearerAuth('google'));
    oneOfUnauthorized.push({
      data: {},
      success: false,
      messagePath: 'auth.error.socialGoogle',
      statusCode: ENUM_AUTH_STATUS_CODE_ERROR.SOCIAL_GOOGLE,
    });
  }

  return applyDecorators(
    ...docs,
    DocOneOf(HttpStatus.UNAUTHORIZED, ...oneOfUnauthorized)
  );
}

export function DocOneOf(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const oneOf = [];

  for (const doc of documents) {
    const oneOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        data: {
          example: {},
        },
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      oneOfSchema.properties = {
        ...oneOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto),
        },
      };
    }

    oneOf.push(oneOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        oneOf,
      },
    }),
    ...docs
  );
}

export function DocAnyOf(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const anyOf = [];

  for (const doc of documents) {
    const anyOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        data: {
          example: {},
        },
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      anyOfSchema.properties = {
        ...anyOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto),
        },
      };
    }

    anyOf.push(anyOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        anyOf,
      },
    }),
    ...docs
  );
}

export function DocAllOf(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const allOf = [];

  for (const doc of documents) {
    const allOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        data: {
          example: {},
        },
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      allOfSchema.properties = {
        ...allOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto),
        },
      };
    }

    allOf.push(allOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        allOf,
      },
    }),
    ...docs
  );
}

export function DocRequestFile(options?: IDocRequestFileOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  if (options?.params) {
    const params: MethodDecorator[] = options.params.map(param =>
      ApiParam(param)
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options.queries.map(query =>
      ApiQuery(query)
    );
    docs.push(...queries);
  }

  const fieldName = options?.fieldName || 'file';

  const schemaProperties: Record<string, any> = {
    [fieldName]: {
      type: 'string',
      format: 'binary',
    },
  };

  if (options?.dto) {
    const dtoInstance = new options.dto();
    Object.keys(dtoInstance).forEach(key => {
      schemaProperties[key] = { type: typeof dtoInstance[key] };
    });
  }

  docs.push(
    ApiBody({
      schema: {
        type: 'object',
        properties: schemaProperties,
      },
    })
  );

  return applyDecorators(ApiConsumes('multipart/form-data'), ...docs);
}

export function DocResponseFile(
  options?: IDocResponseFileOptions
): MethodDecorator {
  const httpStatus: HttpStatus = options?.httpStatus ?? HttpStatus.OK;

  return applyDecorators(
    ApiProduces(options?.fileType ?? ENUM_FILE_MIME.CSV),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
    })
  );
}
