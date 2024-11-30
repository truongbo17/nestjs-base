import {
  DynamicModule,
  HttpStatus,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  DateGreaterThanConstraint,
  DateGreaterThanEqualConstraint,
} from 'src/common/request/validations/request.date-greater-than.validation';
import {
  DateLessThanConstraint,
  DateLessThanEqualConstraint,
} from 'src/common/request/validations/request.date-less-than.validation';
import {
  GreaterThanEqualOtherPropertyConstraint,
  GreaterThanOtherPropertyConstraint,
} from 'src/common/request/validations/request.greater-than-other-property.validation';
import { IsPasswordConstraint } from 'src/common/request/validations/request.is-password.validation';
import {
  LessThanEqualOtherPropertyConstraint,
  LessThanOtherPropertyConstraint,
} from 'src/common/request/validations/request.less-than-other-property.validation';
import { RequestTimeoutInterceptor } from './interceptors/request.timeout.interceptor';
import { RequestValidationException } from './exceptions/request.validation.exception';

@Module({})
export class RequestModule {
  static forRoot(): DynamicModule {
    return {
      module: RequestModule,
      controllers: [],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: RequestTimeoutInterceptor,
        },
        {
          provide: APP_PIPE,
          useFactory: () =>
            new ValidationPipe({
              transform: true,
              skipUndefinedProperties: true,
              // forbidUnknownValues: true,
              errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
              exceptionFactory: async (errors: ValidationError[]) =>
                new RequestValidationException(errors),
            }),
        },
        DateGreaterThanEqualConstraint,
        DateGreaterThanConstraint,
        DateLessThanEqualConstraint,
        DateLessThanConstraint,
        GreaterThanEqualOtherPropertyConstraint,
        GreaterThanOtherPropertyConstraint,
        IsPasswordConstraint,
        LessThanEqualOtherPropertyConstraint,
        LessThanOtherPropertyConstraint,
      ],
      imports: [],
    };
  }
}
