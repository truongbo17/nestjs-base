import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import stringHelper from '../../../utils/helper.string';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return value ? stringHelper.checkPasswordStrength(value) : false;
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
}
