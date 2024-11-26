import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IFile } from '../interfaces/file.interface';
import { ENUM_FILE_STATUS_CODE_ERROR } from '../enums/file.status-code.enum';

@Injectable()
export class FileRequiredPipe implements PipeTransform {
  constructor(readonly field?: string) {}

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    let fieldValue: IFile | IFile[] | undefined;

    if (this.field) {
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        fieldValue = value[this.field as keyof IFile] as unknown as
          | IFile
          | IFile[];
      } else {
        throw new UnprocessableEntityException({
          statusCode: ENUM_FILE_STATUS_CODE_ERROR.REQUIRED,
          message:
            'Invalid operation: cannot extract a field from a non-object.',
        });
      }
    } else {
      fieldValue = value;
    }

    await this.validate(fieldValue);

    return value;
  }

  async validate(value: IFile | IFile[]): Promise<void> {
    if (
      !value ||
      (Array.isArray(value) && value.length === 0) ||
      Object.keys(value).length === 0
    ) {
      throw new UnprocessableEntityException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.REQUIRED,
        message: 'file.error.required',
      });
    }

    return;
  }
}
