import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class RequestValidationException extends Error {
  readonly httpStatus: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
  readonly statusCode: number = this.httpStatus;
  readonly errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('request.validation');

    this.errors = errors;
  }
}
