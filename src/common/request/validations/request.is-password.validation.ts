import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import stringHelper from '../../../utils/helper.string';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { I18nLangService } from '../../i18n/services/i18n-lang.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  constructor(private readonly i18nLangService: I18nLangService) {}

  validate(value: string): boolean {
    return value ? stringHelper.checkPasswordStrength(value) : false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return this.i18nLangService.setMessage('validate.password_invalid');
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
